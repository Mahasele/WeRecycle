
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DashboardPage } from './home/dashboard/dashboard.page';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./home/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./home/login/login.module').then( m => m.LoginPageModule)
  },
  {
      path: 'dashboard',
      loadChildren:()=>import('./home/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'admin',
    children:[
    {
      path: 'profile',
      loadChildren: () => import('./admin/profile/profile.module').then( m => m.ProfilePageModule)
    },
    {
      path: 'feedbacks',
      loadChildren: () => import('./admin/feedback/feedback.module').then( m => m.FeedbackPageModule)
    },
    {
      path: 'users',
      loadChildren: () => import('./admin/users/users.module').then( m => m.UsersPageModule)
    },
    {
      path: 'requests',
      loadChildren: () => import('./admin/requests/requests.module').then( m => m.RequestsPageModule)
    },
    {
      path: 'events',
      loadChildren: () => import('./admin/events/events.module').then( m => m.EventsPageModule)
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
    }, 
    {
    path: 'admins',
    loadChildren: () => import('./admin/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'recyclers',
    loadChildren: () => import('./admin/recyclers/recyclers.module').then( m => m.RecyclersPageModule)
  },
  {
    path: 'tips',
    loadChildren: () => import('./admin/tips/tips.module').then( m => m.TipsPageModule)
  },
  {
    path: 'guidelines',
    loadChildren: () => import('./admin/guidelines/guidelines.module').then( m => m.GuidelinesPageModule)
  },
  ]
  },
  
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
