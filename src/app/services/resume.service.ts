import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export interface ResumeTransformResponse {
  message?: string;
  transformedResume?: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'http://localhost:8082/api/resume';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  transformResume(file: File, jobDescription: string): Observable<ResumeTransformResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    return this.http.post<ResumeTransformResponse>(
      `${this.apiUrl}/transform`,
      formData,
      { headers: this.getHeaders() }
    );
  }
}
