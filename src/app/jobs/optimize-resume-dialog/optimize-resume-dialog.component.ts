import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResumeService } from '../../services/resume.service';

export interface OptimizeResumeDialogData {
    jobTitle: string;
    company: string;
    jobDescription: string;
}

export interface OptimizeResumeResult {
    success: boolean;
    resumeId?: string;
    error?: string;
}

@Component({
    selector: 'app-optimize-resume-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './optimize-resume-dialog.component.html',
    styleUrl: './optimize-resume-dialog.component.scss'
})
export class OptimizeResumeDialogComponent {
    selectedFile: File | null = null;
    templateId: string = 'T000001';
    isLoading: boolean = false;
    isDownloading: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';

    templates = [
        { id: 'T000001', name: 'Professional Template' },
        { id: 'T000002', name: 'Modern Template' },
        { id: 'T000003', name: 'Creative Template' },
        { id: 'T000004', name: 'Executive Template' }
    ];

    constructor(
        public dialogRef: MatDialogRef<OptimizeResumeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: OptimizeResumeDialogData,
        private resumeService: ResumeService
    ) { }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.type === 'application/pdf') {
                this.selectedFile = file;
                this.errorMessage = '';
            } else {
                this.errorMessage = 'Please select a PDF file';
                this.selectedFile = null;
            }
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                this.selectedFile = file;
                this.errorMessage = '';
            } else {
                this.errorMessage = 'Please select a PDF file';
                this.selectedFile = null;
            }
        }
    }

    removeFile(): void {
        this.selectedFile = null;
    }

    optimizeResume(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Please select a resume file';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        // Debug: Log what we're sending
        console.log('=== Optimize Resume Request ===');
        console.log('File:', this.selectedFile.name, this.selectedFile.size, 'bytes');
        console.log('Job Description:', this.data.jobDescription?.substring(0, 100) + '...');
        console.log('Job Description Length:', this.data.jobDescription?.length);
        console.log('Template ID:', this.templateId);
        console.log('Job Title:', this.data.jobTitle);
        console.log('Company:', this.data.company);

        this.resumeService.createOptimizedResume(
            this.selectedFile,
            this.data.jobDescription,
            this.templateId
        ).subscribe({
            next: (response) => {
                console.log('=== API Response ===', response);
                if (response.success) {
                    this.successMessage = 'Resume optimized successfully! Downloading...';
                    this.isLoading = false;
                    this.isDownloading = true;

                    // Download the optimized resume
                    this.resumeService.downloadResume(response.resumeId).subscribe({
                        next: (blob) => {
                            const filename = `Optimized_Resume_${this.data.company.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                            this.resumeService.triggerDownload(blob, filename);
                            this.isDownloading = false;
                            this.successMessage = 'Resume downloaded successfully!';

                            setTimeout(() => {
                                this.dialogRef.close({ success: true, resumeId: response.resumeId });
                            }, 1500);
                        },
                        error: (error) => {
                            this.isDownloading = false;
                            this.errorMessage = 'Failed to download resume. Please try again.';
                            console.error('Download error:', error);
                        }
                    });
                } else {
                    this.isLoading = false;
                    this.errorMessage = 'Failed to optimize resume. Please try again.';
                }
            },
            error: (error) => {
                this.isLoading = false;
                console.error('=== API Error ===');
                console.error('Status:', error.status);
                console.error('Message:', error.message);
                console.error('Full error:', error);
                this.errorMessage = `Error ${error.status}: ${error.statusText || error.message || 'An error occurred'}`;
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close({ success: false });
    }
}
