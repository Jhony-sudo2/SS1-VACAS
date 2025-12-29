# ss1 - FastAPI clone

Este proyecto clona las rutas principales de tu API Spring Boot bajo el mismo context-path `/api`.

## Requisitos
- Python 3.11+
- MySQL (schema: `schema.sql`)

## Configuración
1. Copia `.env.example` a `.env` y ajusta valores.
2. Asegúrate de tener creada la BD y ejecutado `schema.sql`.

## Ejecutar
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Swagger / OpenAPI
- Swagger UI: `http://localhost:8000/api/doc/swagger-vi.html`
- OpenAPI JSON: `http://localhost:8000/api/v3/api-docs`

## Nota sobre SSL
En Spring usas `.p12`. En FastAPI normalmente se termina TLS en Nginx/LoadBalancer.
Si quieres TLS directo en uvicorn, conviértelo a PEM y usa `--ssl-keyfile` y `--ssl-certfile`.
