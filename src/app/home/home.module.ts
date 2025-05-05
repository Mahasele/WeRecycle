import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TasksComponent } from '../components/tasks/tasks.component';
import { TestimonialsComponent } from '../components/testimonials/testimonials.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,TasksComponent,TestimonialsComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
