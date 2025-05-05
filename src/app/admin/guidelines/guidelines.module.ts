import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidelinesPageRoutingModule } from './guidelines-routing.module';

import { GuidelinesPage } from './guidelines.page';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidelinesPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [GuidelinesPage]
})
export class GuidelinesPageModule {}
