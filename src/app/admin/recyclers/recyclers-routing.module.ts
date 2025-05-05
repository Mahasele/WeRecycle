import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecyclersPage } from './recyclers.page';

const routes: Routes = [
  {
    path: '',
    component: RecyclersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecyclersPageRoutingModule {}
