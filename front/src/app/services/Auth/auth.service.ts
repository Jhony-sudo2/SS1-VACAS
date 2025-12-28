import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Rol, Usuario } from '../../interfaces/Usuario';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: Usuario;
  mensaje: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject!: BehaviorSubject<Usuario | null>;
  currentUser$ = this.getCurrentUser$();
  private readonly baseUrl = `${environment.baseUrlEnv}/auth`;
  private readonly TOKEN_KEY = 'ss1_token';
  private readonly USER_KEY = 'ss1_user';

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) { this.currentUserSubject = new BehaviorSubject<Usuario | null>(this.getCurrentUser());
    this.currentUser$ = this.currentUserSubject.asObservable();}
  

   private getCurrentUser$() {
    // placeholder para que TypeScript no se queje
    return new BehaviorSubject<Usuario | null>(null).asObservable();
  }
  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password };

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body).pipe(
      tap((res) => {
        // Solo guardar si REALMENTE viene un token (caso login completo)
        console.log(res);

        if (res.accessToken && res.user && !res.mensaje) {
          this.setSession(res);
        }
      })
    );
  }

  confirmarCorreo(email: string, codigo: string): Observable<AuthResponse> {
    const data = { email, codigo };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login/a2f`, data).pipe(
      tap((res) => {
        // Aquí ya es obligatorio que venga token + user
        if (res.accessToken && res.user) {
          this.setSession(res);
        }
      })
    );
  }

  private setSession(res: AuthResponse): void {
    const expireDays = 1;

    this.cookies.set(this.TOKEN_KEY, res.accessToken!, {
      expires: expireDays,
      path: '/',
      sameSite: 'Lax',
      secure: true // en dev puedes poner false si no estás en HTTPS
    });

    this.cookies.set(this.USER_KEY, JSON.stringify(res.user), {
      expires: expireDays,
      path: '/',
      sameSite: 'Lax',
      secure: true
    });
  }

  logout(): void {
    this.cookies.delete(this.TOKEN_KEY, '/');
    this.cookies.delete(this.USER_KEY, '/');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const token = this.cookies.get(this.TOKEN_KEY);
    return token || null;
  }

  getCurrentUser(): Usuario | null {
    const raw = this.cookies.get(this.USER_KEY);
    return raw ? JSON.parse(raw) as Usuario : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasType(required: Rol | Rol[]): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
    const req = Array.isArray(required) ? required : [required];
    return req.includes(current.rol);
  }
}
