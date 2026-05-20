import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { OrganismsModule } from '../../organisms/organisms.module';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';
import { TemplatesModule } from '../../templates/templates.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    OrganismsModule,
    MoleculesModule,
    AtomsModule,
    TemplatesModule

  ],
  exports: [HomeComponent]
})
export class HomeModule { }
