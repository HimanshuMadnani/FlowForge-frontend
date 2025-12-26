import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UploadResumeComponent } from './upload-resume/upload-resume.component';
import { JobsComponent } from './jobs/jobs.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'upload-resume', component: UploadResumeComponent },
  { path: 'jobs', component: JobsComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
