import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children:[
      {
        path: 'stats',
        loadChildren: () => import('./../stats/stats.module').then( m => m.StatsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'feedback',
        loadChildren: () => import('./../feedback/feedback.module').then( m => m.FeedbackPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./../history/history.module').then( m => m.HistoryPageModule)
      },
      {
        path: 'guidelines',
        loadChildren: () => import('./../guidelines/guidelines.module').then( m => m.GuidelinesPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./../search/search.module').then( m => m.SearchPageModule)
      },
      {
          path: 'events',
          loadChildren: () => import('./../events/events.module').then( m => m.EventsPageModule)
      },
      {
        path: 'tips',
        loadChildren: () => import('./../tips/tips.module').then( m => m.TipsPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard/stats',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
