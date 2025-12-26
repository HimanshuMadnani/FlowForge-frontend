import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export interface ResumeTransformResponse {
  message?: string;
  transformedResume?: any;
  [key: string]: any;
}

export interface ResumeCreateResponse {
  pdfSize: number;
  resumeId: string;
  success: boolean;
  downloadUrl: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'http://localhost:8080/api/resume';
  private baseUrl = 'http://localhost:8080';

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

  /**
   * Create an optimized resume by uploading the current resume with job description
   * @param file The resume PDF file
   * @param jobDescription The job description text
   * @param templateId The template ID (e.g., "T000001")
   */
  createOptimizedResume(file: File, jobDescription: string, templateId: string): Observable<ResumeCreateResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);
    formData.append('templateId', templateId);

    // Debug logging
    console.log('=== Creating Optimized Resume ===');
    console.log('File:', file.name, file.size, 'bytes');
    console.log('Job Description length:', jobDescription?.length);
    console.log('Template ID:', templateId);
    console.log('API URL:', `${this.baseUrl}/resume/create`);

    return this.http.post<ResumeCreateResponse>(
      `${this.baseUrl}/resume/create`,
      formData
    );
  }

  /**
   * Download the optimized resume PDF
   * @param resumeId The ID of the resume to download
   */
  downloadResume(resumeId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/resume/download/${resumeId}`, {
      responseType: 'blob',
      headers: this.getHeaders()
    });
  }

  /**
   * Helper method to trigger file download in browser
   * @param blob The PDF blob
   * @param filename The filename for the download
   */
  triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

