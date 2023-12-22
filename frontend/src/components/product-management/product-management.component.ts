import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../app/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductComponent } from './create-product/create-product.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { StateService } from '../../app/states/state.service';
import { MediaService } from '../../app/media/media.service';
import { NotificationTypeEnum } from 'src/app/notifications/types/notificationType.enum';
import { NotificationService } from 'src/app/notifications/services/notification.service';
import { catchError, concatMap, from, map, of, EMPTY, finalize } from 'rxjs';
import { Binary } from '@angular/compiler';

@Component({
  selector: 'app-products',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductsComponent implements OnInit {
  productName: string = '';
  currentIndex: { [key: string]: number } = {};
  showWelcome = false;
  products: any = [];
  userRole = this.stateService.userRole;
  userToken = this.stateService.userToken;
  loadingProducts = false;
  constructor(
    private mediaService: MediaService,
    private productService: ProductService,
    public dialog: MatDialog,
    private stateService: StateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.userToken()) {
      this.getProducts();
    }
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe((_response: any) => {
      this.notificationService.setNotification({
        type: NotificationTypeEnum.success,
        text: 'Product deleted successfully',
      });
      this.getProducts();
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      width: '250px',
      data: {},
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (formValues: {
          description: any;
          name: any;
          price: any;
          quantity: any;
          files: any[];
        }) => {
          const product = {
            description: formValues?.description,
            name: formValues?.name,
            price: formValues?.price,
            quantity: formValues?.quantity,
            userId: this.stateService.userId(),
          };

          if (this.validProductData(product)) {
            this.productService
              .addProduct(product)
              .pipe(
                concatMap((response: { id: string }) => {
                  let fileStatuses: { name: string; status: string }[] = [];
                  let isSuccess = true;

                  if (formValues.files && formValues.files.length > 0) {
                     // if any image is null, remove them
                     formValues.files = formValues.files.filter(file => file !== null);
                     return from(formValues.files).pipe(
                      concatMap((file: any) => {
                        return this.mediaService
                          .postMediaForProduct(file, response.id)
                          .pipe(
                            map((_) => {
                              fileStatuses.push({
                                name: file.name,
                                status: 'success',
                              });
                            }),
                            catchError((_error: { status: string }) => {
                              isSuccess = false;
                              fileStatuses.push({
                                name: file.name,
                                status: 'failure',
                              });
                              return of(null);
                            })
                          );
                      }),
                      finalize(() => {
                        this.getProducts();
                        let notificationText = `${product.name} added successfully.`;

                        if (fileStatuses.length > 0) {
                          let successfulFiles = fileStatuses
                            .filter((file) => file.status === 'success')
                            .map((file) => file.name);
                          let failedFiles = fileStatuses
                            .filter((file) => file.status === 'failure')
                            .map((file) => file.name);

                          if (successfulFiles.length > 0) {
                            notificationText += ` Media files ${successfulFiles.join(
                              ', '
                            )} added successfully.`;
                          }

                          if (failedFiles.length > 0) {
                            isSuccess = false;
                            notificationText += ` Media files ${failedFiles.join(
                              ', '
                            )} failed to add.`;
                          }
                        }

                        this.notificationService.setNotification({
                          type: isSuccess
                            ? NotificationTypeEnum.success
                            : NotificationTypeEnum.danger,
                          text: notificationText,
                        });
                      })
                    );
                  } else {
                    this.getProducts();
                    this.notificationService.setNotification({
                      type: NotificationTypeEnum.success,
                      text: `${product.name} added successfully.`,
                    });
                    return EMPTY;
                  }
                })
              )
              .subscribe(
                (_) => {},
                (error: { status: string }) => {
                  this.getProducts();
                  this.notificationService.setNotification({
                    type: NotificationTypeEnum.danger,
                    text: `Error adding product: ${error.status}`,
                  });
                }
              );
          }
        }
      );
  }

  editProduct(product: any, productId: string) {
    const dialogRef = this.dialog.open(ModifyProductComponent, {
      width: '250px',
      data: product,
    });
  
    dialogRef.afterClosed().subscribe((formValues: {
      description: any;
      name: any;
      price: any;
      quantity: any;
      files: any[];
    }) => {
      if (formValues) {
        const updatedProduct = {
          id: productId,
          description: formValues.description,
          name: formValues.name,
          price: formValues.price,
          quantity: formValues.quantity,
          userId: this.stateService.userId(),
        };
  
        if (this.validProductData(updatedProduct)) {
          this.productService.editProduct(updatedProduct, updatedProduct.id).pipe(
            concatMap((response: any) => {
              let fileStatuses: { name: string; status: string }[] = [];
              let isSuccess = true;
  
              if (formValues.files && formValues.files.length > 0) {
                // if any image is null, remove them
                formValues.files = formValues.files.filter(file => file !== null);
                return from(formValues.files).pipe(
                  concatMap((file: any) => {
                    return this.mediaService.postMediaForProduct(file, updatedProduct.id).pipe(
                      map((_) => {
                        fileStatuses.push({ name: file.name, status: 'success' });
                      }),
                      catchError((_error: any) => {
                        isSuccess = false;
                        fileStatuses.push({ name: file.name, status: 'failure' });
                        return of(null);
                      })
                    );
                  }),
                  finalize(() => {
                    this.getProducts();
                    let notificationText = `${updatedProduct.name} updated successfully.`;
  
                    if (fileStatuses.length > 0) {
                      let successfulFiles = fileStatuses.filter(file => file.status === 'success').map(file => file.name);
                      let failedFiles = fileStatuses.filter(file => file.status === 'failure').map(file => file.name);
  
                      if (successfulFiles.length > 0) {
                        notificationText += ` Media files ${successfulFiles.join(', ')} updated successfully.`;
                      }
  
                      if (failedFiles.length > 0) {
                        isSuccess = false;
                        notificationText += ` Media files ${failedFiles.join(', ')} failed to update.`;
                      }
                    }
  
                    this.notificationService.setNotification({
                      type: isSuccess ? NotificationTypeEnum.success : NotificationTypeEnum.danger,
                      text: notificationText,
                    });
                  })
                );
              } else {
                this.getProducts();
                this.notificationService.setNotification({
                  type: NotificationTypeEnum.success,
                  text: `${updatedProduct.name} updated successfully.`,
                });
                return EMPTY;
              }
            })
          ).subscribe(
            (_) => {},
            (error: any) => {
              this.getProducts();
              this.notificationService.setNotification({
                type: NotificationTypeEnum.danger,
                text: `Error updating product: ${error}`,
              });
            }
          );
        }
      }
    });
  }
  

  async getProducts() {
    this.loadingProducts = true;
    this.products = await this.productService.getProducts().toPromise();
    this.products?.forEach((product: any) => {
      this.currentIndex[product.id] = 0;
      product.currentImageIndex = 0;
    });
    this.loadingProducts = false;
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

  // delete all media for a product
  deleteImages(productId: string) {
    this.mediaService.deleteMediaForProduct(productId).subscribe(() => {
      this.notificationService.setNotification({
        type: NotificationTypeEnum.success,
        text: 'Images deleted successfully',
      });
      this.getProducts();
    });
  }

  validProductData(productData: any) {
    if (!productData) {
      return false;
    }
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.quantity
    ) {
      return false;
    }
    return true;
  }
}
