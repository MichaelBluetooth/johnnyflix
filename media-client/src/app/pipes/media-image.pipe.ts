import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'mediaImage',
  standalone: true,
})
export class MediaImagePipe implements PipeTransform {

  transform(mediaId: number, poster: string): any {
    let url = `api/image/${mediaId}/poster/${poster}`;
    return `${environment.baseUrl}${url}`;
  }
}
