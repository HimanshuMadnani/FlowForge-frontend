import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';

interface NavItem {
    icon: string;
    label: string;
    route: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        RouterOutlet,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatTooltipModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    sidenavOpened = true;

    navItems: NavItem[] = [
        { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
        { icon: 'work', label: 'Job Listings', route: '/dashboard/jobs' },
        { icon: 'upload_file', label: 'Upload Resume', route: '/dashboard/upload-resume' }
    ];

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    toggleSidenav(): void {
        this.sidenavOpened = !this.sidenavOpened;
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    isActive(route: string): boolean {
        return this.router.url === route;
    }
}
