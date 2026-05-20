import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { TemplatesModule } from '../../templates/templates.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TemplatesModule,
    FormsModule,
    ReactiveFormsModule

  ],
  exports: [AdminComponent]
})
export class AdminModule { }
