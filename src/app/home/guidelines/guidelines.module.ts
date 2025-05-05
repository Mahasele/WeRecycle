import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidelinesPageRoutingModule } from './guidelines-routing.module';

import { GuidelinesPage } from './guidelines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidelinesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [GuidelinesPage]
})
export class GuidelinesPageModule {}
