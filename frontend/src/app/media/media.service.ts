import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private url = 'https://localhost:447/media';
  constructor(private requestService: RequestService) {}

  getMediaFromProduct(productId: String) {
    return this.requestService.httpRequest('GET', `${this.url}/${productId}`);
  }

  postMediaForProduct(mediaFile: any, productId: string) {
    const formData = new FormData();
    formData.append('file', mediaFile);
    formData.append('productId', productId);
    return this.requestService.httpRequest('POST', `https://localhost:447/media`, formData);
   }

   deleteMediaForProduct(productId: string) {
    return this.requestService.httpRequest('DELETE', `${this.url}/${productId}`);
   }
}
