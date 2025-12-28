import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AtencionEmpleadoDTO, MedicamentoMinimo, ReporteFinancieroDTO, TopMedicamentoDTO } from '../interfaces/Reporte';
import { Detalle, PagoSesion, ResponseReceta, Venta } from '../interfaces/Pago';
import { Medicamento } from '../interfaces/Medicamento';
import { HistoriaDetail } from '../interfaces/Historia';
import { Sesion } from '../interfaces/Sesion';

(<any>pdfMake).addVirtualFileSystem(pdfFonts);

type ReportesPayload = {
  desde: string;
  hasta: string;
  top: number;

  financiero: ReporteFinancieroDTO | null;
  minimos: MedicamentoMinimo[];
  topMedicamentos: TopMedicamentoDTO[];
  atencion: AtencionEmpleadoDTO[];
  nombreEmpresa?: string; // opcional
};

export class PdGenerator {

  generarPdfReportes(payload: ReportesPayload, action: 'open' | 'download' | 'print' = 'open') {
    const ahora = new Date();

    const doc: any = {
      pageSize: 'A4',
      pageMargins: [40, 70, 40, 55],

      header: (currentPage: number, pageCount: number) => ({
        margin: [40, 20, 40, 0],
        columns: [
          {
            width: '*',
            stack: [
              { text: payload.nombreEmpresa ?? 'Reportes', style: 'headerTitle' },
              { text: 'Resumen de reportes (Financiero / Stock / Top / Atención)', style: 'headerSub' },
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: this.formatDateTime(ahora), style: 'headerMeta' },
              { text: `Página ${currentPage} de ${pageCount}`, style: 'headerMeta' },
            ],
            alignment: 'right'
          }
        ]
      }),

      footer: () => ({
        margin: [40, 0, 40, 20],
        columns: [
          { text: 'Generado automáticamente', style: 'footer' },
          { text: ' ', width: '*' },
          { text: 'Confidencial', style: 'footer', alignment: 'right' }
        ]
      }),

      content: [
        this.blockFiltros(payload.desde, payload.hasta, payload.top),

        { text: 'Resumen', style: 'sectionTitle', margin: [0, 14, 0, 6] },
        this.blockResumen(payload.financiero, payload.minimos, payload.topMedicamentos, payload.atencion),

        { text: 'Reporte financiero', style: 'sectionTitle', margin: [0, 16, 0, 6] },
        this.blockFinanciero(payload.financiero),

        { text: 'Medicamentos en mínimo', style: 'sectionTitle', margin: [0, 16, 0, 6] },
        this.blockMinimos(payload.minimos),

        { text: `Top ${payload.top} medicamentos`, style: 'sectionTitle', margin: [0, 16, 0, 6] },
        this.blockTop(payload.topMedicamentos),

        { text: 'Atención por empleado', style: 'sectionTitle', margin: [0, 16, 0, 6] },
        this.blockAtencion(payload.atencion),
      ],

      styles: {
        headerTitle: { fontSize: 16, bold: true },
        headerSub: { fontSize: 10, color: '#555' },
        headerMeta: { fontSize: 9, color: '#666' },

        sectionTitle: { fontSize: 13, bold: true, color: '#111' },

        label: { fontSize: 10, color: '#444' },
        value: { fontSize: 10, bold: true, color: '#111' },

        tableHeader: { bold: true, fontSize: 10, color: 'white', fillColor: '#111', margin: [0, 4, 0, 4] },
        tableCell: { fontSize: 9, color: '#111' },
        tableCellMuted: { fontSize: 9, color: '#555' },

        badgeOk: { fontSize: 9, color: 'white', fillColor: '#2E7D32', margin: [0, 2, 0, 2] },
        badgeWarn: { fontSize: 9, color: 'white', fillColor: '#B26A00', margin: [0, 2, 0, 2] },

        footer: { fontSize: 9, color: '#777' }
      },

      defaultStyle: { fontSize: 10 }
    };

    const pdf = (pdfMake as any).createPdf(doc);

    if (action === 'download') {
      pdf.download(`reportes_${this.safeDateFile(new Date())}.pdf`);
      return;
    }
    if (action === 'print') {
      pdf.print();
      return;
    }
    pdf.open();
  }

  private blockFiltros(desde: string, hasta: string, top: number) {
    return {
      table: {
        widths: ['*', '*', '*'],
        body: [[
          this.kv('Desde', desde ? this.formatDateSimple(desde) : '—'),
          this.kv('Hasta', hasta ? this.formatDateSimple(hasta) : '—'),
          this.kv('Top', String(top)),
        ]]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 6]
    };
  }

  private blockResumen(fin: ReporteFinancieroDTO | null, minimos: MedicamentoMinimo[], top: TopMedicamentoDTO[], at: AtencionEmpleadoDTO[]) {
    const cards = [
      this.summaryCard('Ingresos ventas', fin ? this.formatMoney(fin.ingresosVentas) : '—'),
      this.summaryCard('Ingresos sesiones', fin ? this.formatMoney(fin.ingresosSesiones) : '—'),
      this.summaryCard('Ingresos totales', fin ? this.formatMoney(fin.ingresosTotales) : '—'),
      this.summaryCard('Nómina estimada', fin ? this.formatMoney(fin.costoNominaEstimado) : '—'),
      this.summaryCard('Ganancia estimada', fin ? this.formatMoney(fin.gananciaEstimada) : '—'),
      this.summaryCard('En mínimo', String(minimos?.length ?? 0)),
      this.summaryCard('Top meds', String(top?.length ?? 0)),
      this.summaryCard('Atención (empleados)', String(at?.length ?? 0)),
    ];

    const rows: any[] = [];
    for (let i = 0; i < cards.length; i += 3) {
      rows.push([cards[i] ?? '', cards[i + 1] ?? '', cards[i + 2] ?? '']);
    }

    return {
      table: { widths: ['*', '*', '*'], body: rows },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      }
    };
  }

  private blockFinanciero(fin: ReporteFinancieroDTO | null) {
    if (!fin) return this.noData('Sin datos financieros para el rango indicado.');

    const body = [
      ['Concepto', 'Monto'],
      ['Ingresos por ventas', this.formatMoney(fin.ingresosVentas)],
      ['Ingresos por sesiones', this.formatMoney(fin.ingresosSesiones)],
      ['Ingresos totales', this.formatMoney(fin.ingresosTotales)],
      ['Costo nómina estimado', this.formatMoney(fin.costoNominaEstimado)],
      ['Ganancia estimada', this.formatMoney(fin.gananciaEstimada)],
    ];

    return this.tableNice(body, ['60%', '40%'], { colAlignRight: [1] });
  }

  private blockMinimos(minimos: MedicamentoMinimo[]) {
    if (!minimos || minimos.length === 0) return this.noData('No hay medicamentos en mínimo.');

    const body: any[] = [
      ['Medicamento', 'Stock', 'Mínimo', 'Precio', 'Tipo', 'Estado'],
      ...minimos.map(m => {
        const enRiesgo = m.stock <= m.minimo;
        return [
          { text: m.nombre, style: 'tableCell' },
          { text: this.formatNumber(m.stock), style: 'tableCellMuted', alignment: 'right' },
          { text: this.formatNumber(m.minimo), style: 'tableCellMuted', alignment: 'right' },
          { text: this.formatMoney(m.precio), style: 'tableCellMuted', alignment: 'right' },
          { text: m.tipo ? 'Tipo A' : 'Tipo B', style: 'tableCellMuted', alignment: 'center' },
          enRiesgo
            ? { text: 'EN RIESGO', style: 'badgeWarn', alignment: 'center' }
            : { text: 'OK', style: 'badgeOk', alignment: 'center' },
        ];
      })
    ];

    return this.tableNice(body, ['36%', '11%', '11%', '14%', '12%', '16%'], { colAlignRight: [1, 2, 3] });
  }

  private blockTop(topMedicamentos: TopMedicamentoDTO[]) {
    if (!topMedicamentos || topMedicamentos.length === 0) return this.noData('No hay datos de top medicamentos.');

    const totalCant = topMedicamentos.reduce((acc, x) => acc + (Number(x.cantidad) || 0), 0);

    const body: any[] = [
      ['#', 'Medicamento', 'Cantidad'],
      ...topMedicamentos.map((t, idx) => ([
        { text: String(idx + 1), style: 'tableCellMuted', alignment: 'right' },
        { text: t.nombre, style: 'tableCell' },
        { text: this.formatNumber(t.cantidad), style: 'tableCellMuted', alignment: 'right' }
      ])),
      [
        { text: 'TOTAL', colSpan: 2, style: 'tableCell', alignment: 'right' }, {},
        { text: this.formatNumber(totalCant), style: 'tableCell', alignment: 'right' }
      ]
    ];

    return this.tableNice(body, ['10%', '65%', '25%'], { colAlignRight: [0, 2] });
  }

  private blockAtencion(atencion: AtencionEmpleadoDTO[]) {
    if (!atencion || atencion.length === 0) return this.noData('No hay datos de atención.');

    const totalSesiones = atencion.reduce((acc, x) => acc + (Number(x.sesionesPagadas) || 0), 0);
    const totalRecaudado = atencion.reduce((acc, x) => acc + (Number(x.totalRecaudado) || 0), 0);

    const body: any[] = [
      ['Empleado', 'Sesiones pagadas', 'Total recaudado'],
      ...atencion.map(a => ([
        { text: a.empleadoNombre, style: 'tableCell' },
        { text: this.formatNumber(a.sesionesPagadas), style: 'tableCellMuted', alignment: 'right' },
        { text: this.formatMoney(a.totalRecaudado), style: 'tableCellMuted', alignment: 'right' },
      ])),
      [
        { text: 'TOTALES', style: 'tableCell', alignment: 'right' },
        { text: this.formatNumber(totalSesiones), style: 'tableCell', alignment: 'right' },
        { text: this.formatMoney(totalRecaudado), style: 'tableCell', alignment: 'right' },
      ]
    ];

    return this.tableNice(body, ['55%', '20%', '25%'], { colAlignRight: [1, 2] });
  }

  // ================== HELPERS PDF ==================
  private kv(label: string, value: string) {
    return {
      stack: [
        { text: label, style: 'label' },
        { text: value, style: 'value' },
      ],
      margin: [0, 0, 0, 0]
    };
  }

  private summaryCard(title: string, value: string) {
    return {
      table: {
        widths: ['*'],
        body: [[
          {
            fillColor: '#F6F7FB',
            margin: [10, 10, 10, 10],
            stack: [
              { text: title, style: 'label' },
              { text: value, style: 'value', margin: [0, 2, 0, 0] },
            ]
          }
        ]]
      },
      layout: 'noBorders'
    };
  }

  private noData(msg: string) {
    return {
      table: {
        widths: ['*'],
        body: [[{
          fillColor: '#F6F7FB',
          margin: [10, 10, 10, 10],
          text: msg,
          color: '#555'
        }]]
      },
      layout: 'noBorders'
    };
  }

  private tableNice(body: any[], widths: string[], opts?: { colAlignRight?: number[] }) {
    const colAlignRight = new Set(opts?.colAlignRight ?? []);

    const mapped = body.map((row, idx) => {
      if (idx === 0) return row.map((c: any) => ({ text: c, style: 'tableHeader' }));

      return row.map((cell: any, colIdx: number) => {

        // strings -> ok
        if (typeof cell === 'string') {
          return {
            text: cell,
            style: 'cellMuted',
            alignment: colAlignRight.has(colIdx) ? 'right' : 'left'
          };
        }

        // null/undefined -> celda vacía válida
        if (cell == null) return { text: '' };

        // objetos
        if (typeof cell === 'object') {
          // ✅ si es placeholder vacío {}, NO tocar
          if (Object.keys(cell).length === 0) return cell;

          // ✅ si tiene colSpan/rowSpan y NO tiene texto, poner texto vacío
          // (por seguridad cuando alguien mande un objeto sin "text")
          const hasContent =
            'text' in cell || 'stack' in cell || 'table' in cell || 'image' in cell || 'columns' in cell || 'canvas' in cell;

          const fixed = hasContent ? cell : { ...cell, text: '' };

          // ✅ solo agregar alignment si hay contenido (no placeholder)
          if (!fixed.alignment && colAlignRight.has(colIdx)) {
            return { ...fixed, alignment: 'right' };
          }
          return fixed;
        }

        // cualquier otro tipo
        return { text: String(cell), style: 'cellMuted' };
      });
    });

    return {
      table: { headerRows: 1, widths, body: mapped },
      layout: {
        fillColor: (rowIndex: number) => (rowIndex === 0 ? null : (rowIndex % 2 === 0 ? '#FAFAFA' : null)),
        hLineWidth: (i: number) => (i === 0 ? 0 : 0.5),
        vLineWidth: () => 0.5,
        hLineColor: () => '#DDD',
        vLineColor: () => '#DDD',
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 4,
        paddingBottom: () => 4
      }
    };
  }

  // ================== FORMATO ==================
  private formatMoney(n: number) {
    try {
      return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n ?? 0);
    } catch {
      return `Q ${this.formatNumber(n ?? 0)}`;
    }
  }

  private formatNumber(n: number) {
    return new Intl.NumberFormat('es-GT', { maximumFractionDigits: 2 }).format(n ?? 0);
  }

  private formatDateTime(d: Date) {
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(d);
  }

  private formatDateSimple(s: string) {
    // soporta YYYY-MM-DD -> DD/MM/YYYY
    const m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return s;
  }

  private safeDateFile(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}${m}${da}_${hh}${mm}`;
  }

  pdfFacturaSesion(pagoSesion: PagoSesion, action: 'open' | 'download' | 'print' = 'open') {
    const esSesion = !!pagoSesion?.sesion;
    const esCita = !!pagoSesion?.cita;

    const pacienteNombre =
      (esSesion ? pagoSesion.sesion?.historia?.paciente?.nombre : pagoSesion.cita?.paciente?.nombre) ?? '—';

    const empleadoNombre =
      (esSesion ? pagoSesion.sesion?.historia?.empleado?.nombre : pagoSesion.cita?.empleado?.nombre) ?? '—';

    const fechaServicio =
      (esSesion ? pagoSesion.sesion?.fecha : pagoSesion.cita?.fecha) ?? '';

    const numeroSesion = pagoSesion.sesion?.numero;

    const folio = esSesion
      ? `FS-${pagoSesion.id ?? 'SN'}`
      : `FC-${pagoSesion.id ?? 'SN'}`;

    const descripcion = esSesion
      ? `Sesión terapéutica${numeroSesion != null ? ` #${numeroSesion}` : ''}`
      : `Cita de atención`;

    const total = Number(pagoSesion.total ?? 0);

    // Si tenés el costoSesion en historia, lo mostramos como referencia (opcional)
    const costoRef = esSesion ? Number(pagoSesion.sesion?.historia?.costoSesion ?? 0) : 0;

    const doc: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 55],

      header: () => ({
        margin: [40, 18, 40, 0],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'FACTURA', style: 'title' },
              { text: 'Pago de servicio', style: 'subtitle' }
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: `Folio: ${folio}`, style: 'meta', alignment: 'right' },
              { text: `Fecha: ${this.formatDateTime(new Date())}`, style: 'meta', alignment: 'right' }
            ]
          }
        ]
      }),

      footer: () => ({
        margin: [40, 0, 40, 20],
        columns: [
          { text: 'Gracias por su preferencia', style: 'footer' },
          { text: ' ', width: '*' },
          { text: 'Confidencial', style: 'footer', alignment: 'right' }
        ]
      }),

      content: [
        // Datos cliente / servicio
        this.cardTwoCols(
          [
            this.kv('Paciente', pacienteNombre),
            this.kv('Profesional', empleadoNombre),
            this.kv('Tipo de servicio', esSesion ? 'Sesión' : (esCita ? 'Cita' : '—')),
            this.kv('Fecha del servicio', fechaServicio ? this.formatDateSimple(fechaServicio) : '—'),
          ],
          [
            this.kv('Pago', 'Tarjeta'),
            this.kv('Tarjeta', this.maskCard(pagoSesion.tarjeta)),
            this.kv('Código', pagoSesion.codigo ? String(pagoSesion.codigo) : '—'),
            this.kv('Vencimiento', pagoSesion.fechaVencimiento ? String(pagoSesion.fechaVencimiento) : '—'),
          ]
        ),

        { text: 'Detalle', style: 'section', margin: [0, 16, 0, 6] },

        this.tableNice(
          [
            ['Descripción', 'Cant.', 'Precio', 'Subtotal'],
            [
              { text: descripcion, style: 'cell' },
              { text: '1', style: 'cellMuted', alignment: 'right' },
              { text: this.formatMoney(total || costoRef || 0), style: 'cellMuted', alignment: 'right' },
              { text: this.formatMoney(total || costoRef || 0), style: 'cellMuted', alignment: 'right' }
            ]
          ],
          ['58%', '12%', '15%', '15%'],
          { colAlignRight: [1, 2, 3] }
        ),

        { text: 'Totales', style: 'section', margin: [0, 16, 0, 6] },

        this.totalsBlock({
          subtotal: total || costoRef || 0,
          descuento: 0,
          total: total || costoRef || 0
        }),

        // Nota opcional si fue sesión
        ...(esSesion && pagoSesion.sesion?.observaciones
          ? [{ text: 'Observaciones', style: 'section', margin: [0, 16, 0, 6] },
          this.noteBox(pagoSesion.sesion.observaciones)]
          : [])
      ],

      styles: this.invoiceStyles()
    };

    const pdf = (pdfMake as any).createPdf(doc);
    this.runPdf(pdf, action, `factura_${folio}_${this.safeDateFile(new Date())}.pdf`);
  }

  // =============================
  //  FACTURA COMPRA (VENTA)
  // =============================
  pdfFacturaCompra(venta: Venta, detalle: any[], action: 'open' | 'download' | 'print' = 'open') {
    const folio = `FV-${venta?.id ?? 'SN'}`;
    const pacienteNombre = venta?.paciente?.nombre ?? '—';
    const fecha = venta?.fecha ?? '';
    const totalVenta = Number(venta?.total ?? 0);

    const rows = (detalle ?? []).map((d: any) => {
      const med: Medicamento | undefined = d?.medicamento;
      const nombre = d?.nombre ?? med?.nombre ?? '—';
      const cantidad = Number(d?.cantidad ?? 0);

      // precio flexible
      const precioUnit =
        Number(d?.precio ?? d?.precioUnitario ?? d?.precioUnit ?? med?.precio ?? 0);

      const subtotal = Number(d?.subtotal ?? (cantidad * precioUnit));

      return {
        nombre,
        cantidad,
        precioUnit,
        subtotal
      };
    });

    const subtotalCalc = rows.reduce((acc, r) => acc + (Number(r.subtotal) || 0), 0);
    const totalFinal = totalVenta > 0 ? totalVenta : subtotalCalc;

    const doc: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 55],

      header: () => ({
        margin: [40, 18, 40, 0],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'FACTURA', style: 'title' },
              { text: 'Compra de medicamentos', style: 'subtitle' }
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: `Folio: ${folio}`, style: 'meta', alignment: 'right' },
              { text: `Fecha: ${fecha ? this.formatDateSimple(fecha) : this.formatDateTime(new Date())}`, style: 'meta', alignment: 'right' }
            ]
          }
        ]
      }),

      footer: () => ({
        margin: [40, 0, 40, 20],
        columns: [
          { text: 'Gracias por su compra', style: 'footer' },
          { text: ' ', width: '*' },
          { text: venta?.estadoEntrega ? 'Entrega: COMPLETADA' : 'Entrega: PENDIENTE', style: 'footer', alignment: 'right' }
        ]
      }),

      content: [
        this.cardTwoCols(
          [
            this.kv('Cliente', pacienteNombre),
            this.kv('Entrega', venta?.estadoEntrega ? 'Completada' : 'Pendiente'),
          ],
          [
            this.kv('Pago', 'Tarjeta'),
            this.kv('Tarjeta', this.maskCard(venta?.tarjeta)),
            this.kv('Código', venta?.codigo ? String(venta.codigo) : '—'),
            this.kv('Vencimiento', venta?.fechaVencimiento ? String(venta.fechaVencimiento) : '—'),
          ]
        ),

        { text: 'Detalle de compra', style: 'section', margin: [0, 16, 0, 6] },

        rows.length === 0
          ? this.noData('No hay detalle para esta venta.')
          : this.tableNice(
            [
              ['#', 'Producto', 'Cant.', 'P. Unit', 'Subtotal'],
              ...rows.map((r, idx) => ([
                { text: String(idx + 1), style: 'cellMuted', alignment: 'right' },
                { text: r.nombre, style: 'cell' },
                { text: this.formatNumber(r.cantidad), style: 'cellMuted', alignment: 'right' },
                { text: this.formatMoney(r.precioUnit), style: 'cellMuted', alignment: 'right' },
                { text: this.formatMoney(r.subtotal), style: 'cellMuted', alignment: 'right' },
              ])),
              [
                { text: 'TOTAL', colSpan: 4, style: 'cell', alignment: 'right' }, {}, {}, {},
                { text: this.formatMoney(totalFinal), style: 'cell', alignment: 'right' }
              ]
            ],
            ['7%', '45%', '12%', '18%', '18%'],
            { colAlignRight: [0, 2, 3, 4] }
          ),

        { text: 'Totales', style: 'section', margin: [0, 16, 0, 6] },
        this.totalsBlock({
          subtotal: subtotalCalc,
          descuento: 0,
          total: totalFinal
        })
      ],

      styles: this.invoiceStyles()
    };

    const pdf = (pdfMake as any).createPdf(doc);
    this.runPdf(pdf, action, `factura_${folio}_${this.safeDateFile(new Date())}.pdf`);
  }

  // =============================
  // Helpers comunes de factura
  // =============================
  private invoiceStyles() {
    return {
      title: { fontSize: 18, bold: true, color: '#111' },
      subtitle: { fontSize: 10, color: '#666' },
      meta: { fontSize: 9, color: '#666' },

      section: { fontSize: 12, bold: true, color: '#111' },

      label: { fontSize: 9, color: '#444' },
      value: { fontSize: 10, bold: true, color: '#111' },

      tableHeader: { bold: true, fontSize: 10, color: 'white', fillColor: '#111', margin: [0, 4, 0, 4] },
      cell: { fontSize: 9, color: '#111' },
      cellMuted: { fontSize: 9, color: '#555' },

      footer: { fontSize: 9, color: '#777' }
    };
  }

  private runPdf(pdf: any, action: 'open' | 'download' | 'print', filename: string) {
    if (action === 'download') { pdf.download(filename); return; }
    if (action === 'print') { pdf.print(); return; }
    pdf.open();
  }

  private cardTwoCols(left: any[], right: any[]) {
    return {
      table: {
        widths: ['*', '*'],
        body: [[
          { fillColor: '#F6F7FB', margin: [10, 10, 10, 10], stack: left },
          { fillColor: '#F6F7FB', margin: [10, 10, 10, 10], stack: right },
        ]]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 0]
    };
  }

  private noteBox(text: string) {
    return {
      table: {
        widths: ['*'],
        body: [[{
          fillColor: '#F6F7FB',
          margin: [10, 10, 10, 10],
          text: text || '—',
          color: '#555'
        }]]
      },
      layout: 'noBorders'
    };
  }

  private totalsBlock(vals: { subtotal: number; descuento: number; total: number }) {
    return {
      table: {
        widths: ['*', 'auto'],
        body: [
          [{ text: 'Subtotal', style: 'cellMuted', alignment: 'right' }, { text: this.formatMoney(vals.subtotal), style: 'cellMuted', alignment: 'right' }],
          [{ text: 'Descuento', style: 'cellMuted', alignment: 'right' }, { text: this.formatMoney(vals.descuento), style: 'cellMuted', alignment: 'right' }],
          [{ text: 'TOTAL', style: 'cell', alignment: 'right' }, { text: this.formatMoney(vals.total), style: 'cell', alignment: 'right' }],
        ]
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => '#DDD',
        paddingTop: () => 4,
        paddingBottom: () => 4
      }
    };
  }
  private maskCard(card: string | undefined) {
    const s = (card ?? '').replace(/\s+/g, '');
    if (!s) return '—';
    const last4 = s.slice(-4);
    return `**** **** **** ${last4}`;
  }

  pdfHistoria(detalle: HistoriaDetail, action: 'open'|'download'|'print' = 'open') {
    const h = detalle?.historia;
    const p = h?.paciente;

    const pacienteNombre = p?.nombre ?? '—';
    const empleadoNombre = (h?.empleado as any)?.nombre ?? (h?.empleado as any)?.nombreCompleto ?? '—';

    const folio = `HC-${h?.id ?? 'SN'}`;

    const doc: any = {
      pageSize: 'A4',
      pageMargins: [40, 70, 40, 55],

      header: (currentPage: number, pageCount: number) => ({
        margin: [40, 18, 40, 0],
        columns: [
          {
            width: '*',
            stack: [
              { text: 'HISTORIA CLÍNICA', style: 'title' },
              { text: `Folio: ${folio}`, style: 'subtitle' },
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: this.formatDateTime(new Date()), style: 'meta', alignment: 'right' },
              { text: `Página ${currentPage} de ${pageCount}`, style: 'meta', alignment: 'right' },
            ]
          }
        ]
      }),

      footer: () => ({
        margin: [40, 0, 40, 20],
        columns: [
          { text: 'Documento clínico - uso interno', style: 'footer' },
          { text: ' ', width: '*' },
          { text: 'Confidencial', style: 'footer', alignment: 'right' }
        ]
      }),

      content: [
        // Resumen de cabecera (Paciente / Profesional / Datos historia)
        this.cardTwoCols(
          [
            this.kv('Paciente', pacienteNombre),
            this.kv('Teléfono', p?.telefono ?? '—'),
            this.kv('Dirección', p?.direccion ?? '—'),
            this.kv('Procedencia', (p?.procedencia as any) ?? '—'),
          ],
          [
            this.kv('Profesional', empleadoNombre),
            this.kv('Fecha apertura', h?.fechaApertura ? this.formatDateSimple(h.fechaApertura) : '—'),
            this.kv('Motivo consulta', h?.motivoConsulta ?? '—'),
            this.kv('Estado', this.asText(h?.estado) ?? '—'),
          ]
        ),

        // Datos clínicos generales
        { text: 'Datos generales', style: 'section', margin: [0, 16, 0, 6] },
        this.tableNice(
          [
            ['Modalidad', 'Sesiones', 'Duración', 'Costo sesión', 'Frecuencia', 'Enfoque'],
            [
              this.asText(h?.modalidad) ?? '—',
              this.formatNumber(h?.sesiones ?? 0),
              `${this.formatNumber(h?.duracion ?? 0)} min`,
              this.formatMoney(h?.costoSesion ?? 0),
              this.asText(h?.frecuencia) ?? '—',
              this.asText(h?.enfoque) ?? '—'
            ]
          ],
          ['18%', '12%', '14%', '18%', '18%', '20%'],
          { colAlignRight: [1,2,3] }
        ),

        // Historia personal
        { text: 'Historia personal', style: 'section', margin: [0, 16, 0, 6] },
        this.longTextCard('Desarrollo', detalle?.historiaPersonal?.desarrollo),
        this.longTextCard('Historia académica', detalle?.historiaPersonal?.historiaAcademica),
        this.longTextCard('Historia médica', detalle?.historiaPersonal?.historiaMedica),
        this.longTextCard('Medicación actual', detalle?.historiaPersonal?.medicacionActual),
        this.longTextCard('Tratamientos previos', detalle?.historiaPersonal?.tratamientosPrevios),
        this.longTextCard('Hospitalizaciones', detalle?.historiaPersonal?.hospitalizaciones),

        // Consumos
        { text: 'Consumo', style: 'section', margin: [0, 16, 0, 6] },
        this.tableNice(
          [
            ['Alcohol', 'Tabaco', 'Drogas'],
            [
              this.asText(detalle?.historiaPersonal?.alcohol) ?? '—',
              this.asText(detalle?.historiaPersonal?.tabaco) ?? '—',
              this.asText(detalle?.historiaPersonal?.drogas) ?? '—',
            ]
          ],
          ['33%', '33%', '34%']
        ),

        // Antecedentes
        { text: 'Antecedentes', style: 'section', margin: [0, 16, 0, 6] },
        this.longTextCard('Estructura familiar / soporte', detalle?.antecedente?.estructura),
        this.longTextCard('Trastornos', detalle?.antecedente?.trastornos),
        this.longTextCard('Eventos relevantes', detalle?.antecedente?.eventos),

        // Estado inicial
        { text: 'Estado inicial', style: 'section', margin: [0, 16, 0, 6] },
        this.tableNice(
          [
            ['Ánimo', 'Ansiedad', 'Func. social', 'Sueño', 'Apetito'],
            [
              this.asText(detalle?.estadoInicial?.animo) ?? '—',
              this.asText(detalle?.estadoInicial?.ansiedad) ?? '—',
              this.asText(detalle?.estadoInicial?.funcionamientosocial) ?? '—',
              this.asText(detalle?.estadoInicial?.suenio) ?? '—',
              this.asText(detalle?.estadoInicial?.apetito) ?? '—',
            ]
          ],
          ['20%', '20%', '20%', '20%', '20%']
        ),
        this.longTextCard('Observaciones', detalle?.estadoInicial?.observaciones),

        // Sesiones
        { text: 'Sesiones', style: 'section', margin: [0, 16, 0, 6] },
        this.blockSesiones(detalle?.sesiones ?? []),

        // Motivo alta (si existiera)
        ...(h?.motivoAlta ? [{ text: 'Motivo de alta', style: 'section', margin: [0, 16, 0, 6] }, this.longTextCard('', h.motivoAlta)] : [])
      ],

      styles: this.historiaStyles()
    };

    const pdf = (pdfMake as any).createPdf(doc);
    this.runPdf(pdf, action, `historia_${folio}_${this.safeDateFile(new Date())}.pdf`);
  }

  // ========== SECCIONES ==========
  private blockSesiones(sesiones: Sesion[]) {
    if (!sesiones || sesiones.length === 0) return this.noData('No hay sesiones registradas.');

    const body: any[] = [
      ['#', 'Fecha', 'Estado', 'Pago', 'Temas', 'Observaciones'],
      ...sesiones
        .sort((a,b) => (a.numero ?? 0) - (b.numero ?? 0))
        .map(s => ([
          { text: String(s.numero ?? ''), style: 'cellMuted', alignment: 'right' },
          { text: s.fecha ? this.formatDateSimple(s.fecha) : '—', style: 'cellMuted' },
          { text: this.asText(s.estado) ?? '—', style: 'cellMuted' },
          s.estadoPago ? { text: 'PAGADA', style: 'badgeOk', alignment: 'center' } : { text: 'PENDIENTE', style: 'badgeWarn', alignment: 'center' },
          { text: this.short(s.temas, 60), style: 'cell' },
          { text: this.short(s.observaciones, 60), style: 'cellMuted' }
        ]))
    ];

    return this.tableNice(
      body,
      ['6%', '14%', '14%', '12%', '27%', '27%'],
      { colAlignRight: [0] }
    );
  }

  private longTextCard(title: string, text?: string) {
    const t = (text ?? '').trim();
    return {
      margin: [0, 6, 0, 0],
      table: {
        widths: ['*'],
        body: [[{
          fillColor: '#F6F7FB',
          margin: [10, 10, 10, 10],
          stack: [
            ...(title ? [{ text: title, style: 'subsection' }] : []),
            { text: t ? t : '—', style: 'paragraph' }
          ]
        }]]
      },
      layout: 'noBorders'
    };
  }

  // ========== ESTILOS ==========
  private historiaStyles() {
    return {
      title: { fontSize: 16, bold: true, color: '#111' },
      subtitle: { fontSize: 10, color: '#666' },
      meta: { fontSize: 9, color: '#666' },

      section: { fontSize: 12, bold: true, color: '#111' },
      subsection: { fontSize: 10, bold: true, color: '#111', margin: [0, 0, 0, 4] },
      paragraph: { fontSize: 9, color: '#333', lineHeight: 1.2 },

      label: { fontSize: 9, color: '#444' },
      value: { fontSize: 10, bold: true, color: '#111' },

      tableHeader: { bold: true, fontSize: 10, color: 'white', fillColor: '#111', margin: [0, 4, 0, 4] },
      cell: { fontSize: 9, color: '#111' },
      cellMuted: { fontSize: 9, color: '#555' },

      badgeOk: { fontSize: 9, color: 'white', fillColor: '#2E7D32', margin: [0, 2, 0, 2] },
      badgeWarn: { fontSize: 9, color: 'white', fillColor: '#B26A00', margin: [0, 2, 0, 2] },

      footer: { fontSize: 9, color: '#777' }
    };
  }

 

  private asText(x: any): string | null {
    if (x == null) return null;
    if (typeof x === 'string') return x;
    if (typeof x === 'number' || typeof x === 'boolean') return String(x);

    // intenta propiedades comunes
    if (typeof x === 'object') {
      return x.nombre ?? x.descripcion ?? x.valor ?? x.label ?? JSON.stringify(x);
    }
    return String(x);
  }

  private short(s?: string, max = 80) {
    const t = (s ?? '').trim();
    if (!t) return '—';
    return t.length > max ? (t.slice(0, max - 1) + '…') : t;
  }

  

}