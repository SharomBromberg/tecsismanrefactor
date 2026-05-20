import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoleculesModule } from './components/molecules/molecules.module';
import { OrganismsModule } from './components/organisms/organisms.module';
import { TemplatesModule } from './components/templates/templates.module';
import { PagesModule } from './components/pages/pages.module';
import { HomeModule } from './components/pages/home/home.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({ declarations: [AppComponent, ProductListComponent, ProductFormComponent],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MoleculesModule,
        OrganismsModule,
        TemplatesModule,
        PagesModule,
        HomeModule,
        NgbModule], providers: [provideClientHydration(), provideHttpClient(withFetch()), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
