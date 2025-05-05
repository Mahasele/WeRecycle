import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecyclersPageRoutingModule } from './recyclers-routing.module';

import { RecyclersPage } from './recyclers.page';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecyclersPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [RecyclersPage]
})
export class RecyclersPageModule {}
