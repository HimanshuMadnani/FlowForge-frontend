import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome to FlowForge</h1>
        <p class="welcome-subtitle">Your AI-powered career companion</p>
      </div>

      <div class="quick-actions">
        <mat-card class="action-card" routerLink="/dashboard/jobs">
          <div class="card-icon jobs-icon">
            <mat-icon>work</mat-icon>
          </div>
          <h3>Browse Jobs</h3>
          <p>Explore job listings tailored for you</p>
          <button mat-stroked-button color="primary">
            View Jobs
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </mat-card>

        <mat-card class="action-card" routerLink="/dashboard/upload-resume">
          <div class="card-icon upload-icon">
            <mat-icon>upload_file</mat-icon>
          </div>
          <h3>Upload Resume</h3>
          <p>Upload and optimize your resume</p>
          <button mat-stroked-button color="primary">
            Upload
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </mat-card>

        <mat-card class="action-card">
          <div class="card-icon ai-icon">
            <mat-icon>auto_fix_high</mat-icon>
          </div>
          <h3>AI Optimization</h3>
          <p>Get AI-powered resume suggestions</p>
          <button mat-stroked-button color="primary">
            Coming Soon
          </button>
        </mat-card>
      </div>

      <div class="stats-section">
        <mat-card class="stat-card">
          <div class="stat-icon">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">390+</span>
            <span class="stat-label">Available Jobs</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon">
            <mat-icon>description</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">AI</span>
            <span class="stat-label">Resume Analysis</span>
          </div>
        </mat-card>

        <mat-card class="stat-card">
          <div class="stat-icon">
            <mat-icon>speed</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">Fast</span>
            <span class="stat-label">Optimization</span>
          </div>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-home {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      color: white;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .welcome-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .action-card {
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-radius: 12px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 1rem 0 0.5rem;
        color: #2d3748;
      }

      p {
        color: #718096;
        margin: 0 0 1.5rem;
        font-size: 0.9rem;
      }

      button {
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          margin-left: 0.5rem;
        }
      }
    }

    .card-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: white;
      }

      &.jobs-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.upload-icon {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      }

      &.ai-icon {
        background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
      }
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 12px;

      .stat-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          color: #667eea;
        }
      }

      .stat-content {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #718096;
        }
      }
    }

    @media (max-width: 768px) {
      .dashboard-home {
        padding: 1rem;
      }

      .welcome-section {
        padding: 2rem 1rem;
      }

      .welcome-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class DashboardHomeComponent { }
