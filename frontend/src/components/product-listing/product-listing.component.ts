import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../app/product/product.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { StateService } from '../../app/states/state.service';

@Component({
  selector: 'app-products',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss'],
    animations: [
      trigger('fade', [
        state('in', style({ opacity: 1, visibility: 'visible' })),
        state('out', style({ opacity: 0, visibility: 'hidden' })),
        transition('out => in', animate('300ms ease-in')),
        transition('in => out', animate('300ms ease-out')),
      ])
    ]
})
export class ProductListingComponent implements OnInit {
  productName: string = '';
  currentIndex: { [key: string]: number } = {};
  showWelcome = false;
  products : any = []
  userRole = this.stateService.userRole;
  userToken = this.stateService.userToken;
  loadingProducts = false;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private stateService: StateService
  ) {}


  ngOnInit(): void {
    if (this.userToken()) {
      this.getProducts();
    }
  }

  async getProducts() {
    this.loadingProducts = true;
    this.products = await this.productService.getPublicProducts().toPromise();
    this.products.forEach((product: any) => {
      this.currentIndex[product.id] = 0;
      product.currentImageIndex = 0;
    });
    this.loadingProducts = false;
  }

  validProductData(productData: any) {
    if (!productData) {
      return false;
    }
    if (!productData.name || !productData.description || !productData.price || !productData.quantity) {
      return false;
    }
    return true;
  }

  nextImage(productId: string) {
    const product = this.products.find(
      (product: any) => product.id === productId
    );
    if (product && product.media.length > 1) {
        product.currentImageIndex =
        (product.currentImageIndex + 1) % product.media.length;
    }
  }

  previousImage(productId: string) {
    const product = this.products.find(
      (product: any) => product.id === productId
    );
    if (product && product.media.length > 1) {
        product.currentImageIndex =
        (product.currentImageIndex - 1 + product.media.length) %
        product.media.length;
    }
  }

  setProductImageIndex(productId: string, index: number) {
    const product = this.products.find(
      (product: any) => product.id === productId
    );
    if (product && product.media.length > 1) {
      product.currentImageIndex = index;
    }
  }

}
