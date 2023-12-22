import { Injectable } from '@angular/core';
import { MediaService } from '../media/media.service';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RequestService } from '../shared/request.service';

@Injectable({
 providedIn: 'root'
})

export class ProductService {
  private url = 'https://localhost:446/private/products';
  constructor(
    private mediaService: MediaService,
    private requestService: RequestService,
  ) {}

  addProduct(productBody: any) {
    return this.requestService.httpRequest('POST', this.url, productBody);
  }

  editProduct(productBody: any, id: string) {
    return this.requestService.httpRequest(
      'PUT',
      `${this.url}/${id}`,
      productBody
    );
  }

  deleteProduct(id: string) {
    return this.requestService.httpRequest('DELETE', `${this.url}/${id}`);
  }

  getProducts(): Observable<any> {
    const products = this.requestService.httpRequest('GET', this.url);
    return products.pipe(
      switchMap((data: any) => this.mergeProductAndMedia(data))
    );
  }

  getPublicProducts(): Observable<any> {
    const publicUrl = 'https://localhost:446/public/products';
    const products = this.requestService.httpRequest('GET', publicUrl);
    return products.pipe(
      switchMap((data: any) => this.mergeProductAndMedia(data))
    );
  }

  mergeProductAndMedia(data: any[]): Observable<any> {
    const received = data as Array<any>;
    const mediaObservables = received.map((element) =>
      this.mediaService.getMediaFromProduct(element.id)
    );
    return forkJoin(mediaObservables).pipe(
      map((mediaResponses: any[]) => {
        return received.map((product, index) => {
          return {
            ...product,
            media: mediaResponses[index].map((media: any) => media.imagePath),
          };
        });
      })
    );
  }
}