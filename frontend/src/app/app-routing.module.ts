import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSignupComponent } from 'src/components/login-signup/login-signup.component';
import { ProductListingComponent } from 'src/components/product-listing/product-listing.component';
import { ProductsComponent } from 'src/components/product-management/product-management.component';
import { ProfileComponent } from 'src/components/profile/profile.component';
import {WelcomePageComponent} from "../components/welcome/welcome-page.component";
const routes: Routes = [
  { path: '', redirectTo: '/welcome-page', pathMatch: 'full' },
  { path: 'product-listing', component: ProductListingComponent},
  { path: 'welcome-page', component: WelcomePageComponent },
  {
    path: 'login', component: LoginSignupComponent
  },
  {
    path: 'products-management', component: ProductsComponent
  },
  {
    path: 'profile', component: ProfileComponent
  },
  {
    // 404 fallback. Redirect all 404 to login page
    path: '**', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
