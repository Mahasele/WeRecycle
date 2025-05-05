import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuidelinesPage } from './guidelines.page';

const routes: Routes = [
  {
    path: '',
    component: GuidelinesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidelinesPageRoutingModule {}
