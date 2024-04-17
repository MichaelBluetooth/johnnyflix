import { Pipe, PipeTransform } from '@angular/core';
import { JflixBaseUrlService } from '../services/base-url.service';
// import { environment } from '../../../../../src/environments/environment';

@Pipe({
  name: 'mediaImage',
  standalone: true,
})
export class MediaImagePipe implements PipeTransform {
  
  constructor(private baseUrlSvc: JflixBaseUrlService){}

  transform(mediaId: number, poster: string): any {
    console.log(`MEDIA IMAGE PIPE: ${this.baseUrlSvc.baseUrl}`);
    let url = `api/image/${mediaId}/poster/${poster}`;
    return `${this.baseUrlSvc.baseUrl}${url}`;
  }
}
