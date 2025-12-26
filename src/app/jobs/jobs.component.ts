import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import jobsData from '../assets/response.json';
import { OptimizeResumeDialogComponent, OptimizeResumeDialogData } from './optimize-resume-dialog/optimize-resume-dialog.component';

interface Job {
  company: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  experience_level: string;
  posted_date: string;
  url: string;
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class JobsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'company', 'location', 'salary', 'experience_level', 'posted_date', 'actions'];
  dataSource: MatTableDataSource<Job>;
  expandedElement: Job | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {
    const jobs: Job[] = (jobsData as any).jobs || [];
    this.dataSource = new MatTableDataSource(jobs.filter(job => job.company !== 'N/A'));
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate for searching all fields
    this.dataSource.filterPredicate = (data: Job, filter: string) => {
      const searchStr = filter.toLowerCase();
      return (
        data.title.toLowerCase().includes(searchStr) ||
        data.company.toLowerCase().includes(searchStr) ||
        data.location.toLowerCase().includes(searchStr) ||
        data.salary.toLowerCase().includes(searchStr) ||
        data.experience_level.toLowerCase().includes(searchStr) ||
        data.description.toLowerCase().includes(searchStr)
      );
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleRow(element: Job): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  openJobUrl(url: string, event: Event): void {
    event.stopPropagation();
    window.open(url, '_blank');
  }

  openOptimizeResumeDialog(job: Job, event: Event): void {
    event.stopPropagation();

    const dialogData: OptimizeResumeDialogData = {
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description
    };

    const dialogRef = this.dialog.open(OptimizeResumeDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: dialogData,
      panelClass: 'optimize-resume-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log('Resume optimized successfully:', result.resumeId);
      }
    });
  }

  getExperienceLevelClass(level: string): string {
    const levelLower = level.toLowerCase();
    if (levelLower.includes('entry') || levelLower.includes('internship')) {
      return 'experience-entry';
    } else if (levelLower.includes('mid') || levelLower.includes('senior')) {
      return 'experience-senior';
    } else if (levelLower.includes('associate')) {
      return 'experience-associate';
    }
    return 'experience-default';
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

