import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  contactNumber: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/user';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  signup(userData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData);
  }

  isLoggedIn(): boolean {
    const token = this.cookieService.get('authToken');
    return !!token && token.length > 0;
  }

  logout(): void {
    this.cookieService.delete('authToken', '/');
  }

  getToken(): string {
    return this.cookieService.get('authToken');
  }
}

