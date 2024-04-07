import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject, from, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'mediaImage',
  standalone: true,
})
export class MediaImagePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  transform(mediaId: number, poster: string): any {
    let url = `api/image/${mediaId}/poster/${poster}`;
    if(!environment.isProd){
      url = `http://localhost:3000/${url}`;
    }
    return url;
  }
}
