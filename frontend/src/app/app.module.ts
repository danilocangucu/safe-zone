import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginSignupComponent } from '../components/login-signup/login-signup.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from '../components/product-management/product-management.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { ProductListingComponent } from '../components/product-listing/product-listing.component';
import { ModifyProductComponent } from '../components/product-management/modify-product/modify-product.component';
import { ConfirmDialogComponent } from '../components/product-management/modify-product/confirm-dialog/confirm-dialog.component';
import { CreateProductComponent } from '../components/product-management/create-product/create-product.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientWithInterceptor } from './interceptors/http-client.interceptor'; // Import your interceptor class here
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomePageComponent } from '../components/welcome/welcome-page.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    ProductsComponent,
    NavbarComponent,
    ProfileComponent,
    ProductListingComponent,
    ModifyProductComponent,
    ConfirmDialogComponent,
    CreateProductComponent,
    WelcomePageComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientWithInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
