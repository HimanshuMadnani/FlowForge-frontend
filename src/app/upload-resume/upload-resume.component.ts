import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CookieService } from 'ngx-cookie-service';
import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-upload-resume',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  providers: [CookieService],
  templateUrl: './upload-resume.component.html',
  styleUrl: './upload-resume.component.scss'
})
export class UploadResumeComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  fileName: string = '';
  loading = false;
  dragOver = false;

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cookieService: CookieService
  ) {
    // Check if user is authenticated
    const token = this.cookieService.get('authToken');
    if (!token) {
      this.router.navigate(['/login']);
    }

    this.uploadForm = this.fb.group({
      jobDescription: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file) {
      // Check if file is PDF
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.fileName = file.name;
      } else {
        this.snackBar.open('Please select a PDF file', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = '';
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a resume file', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.uploadForm.valid) {
      this.loading = true;
      const jobDescription = this.uploadForm.get('jobDescription')?.value;

      this.resumeService.transformResume(this.selectedFile, jobDescription).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Resume transformed successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          
          // Handle the response - you might want to download the file or navigate to results page
          console.log('Transform response:', response);
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.message || 'Failed to transform resume. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.uploadForm.markAllAsTouched();
    }
  }

  logout(): void {
    this.cookieService.delete('authToken', '/');
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    this.router.navigate(['/login']);
  }

  getErrorMessage(): string {
    const control = this.uploadForm.get('jobDescription');
    if (control?.hasError('required')) {
      return 'Job description is required';
    }
    if (control?.hasError('minlength')) {
      return 'Please provide a detailed job description (minimum 10 characters)';
    }
    return '';
  }
}
