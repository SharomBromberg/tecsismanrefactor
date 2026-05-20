import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';

import { AtomsModule } from '../atoms/atoms.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismsModule } from '../organisms/organisms.module';

import { DevelopmentComponent } from './development/development.component';
import { NetworksComponent } from './networks/networks.component';
import { SupportComponent } from './support/support.component';
import { TechnologyComponent } from './technology/technology.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormTemplateComponent } from './product-form-template/product-form-template.component';
import { CategoriesTemplateComponent } from './categories-template/categories-template.component';
import { ProductListTemplateComponent } from './product-list-template/product-list-template.component';


@NgModule({
  declarations: [
    DevelopmentComponent,
    NetworksComponent,
    SupportComponent,
    TechnologyComponent,
    ProductFormTemplateComponent,
    CategoriesTemplateComponent,
    ProductListTemplateComponent,




  ],
  imports: [
    CommonModule,
    AtomsModule,
    MoleculesModule,
    OrganismsModule,
    TemplatesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule

  ],
  exports: [
    DevelopmentComponent,
    NetworksComponent,
    SupportComponent,
    TechnologyComponent,
    ProductFormTemplateComponent,
    CategoriesTemplateComponent,
    ProductListTemplateComponent

  ]
})
export class TemplatesModule { }
