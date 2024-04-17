import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from '../models/media.model';

@Injectable()
export class JflixMediaService {
  SUPPORTED_VERSIONS = [];

  constructor(private http: HttpClient, private componentFactoryResolver: ComponentFactoryResolver) { }

  getMedia(id: number): Observable<Media> {
    return this.http.get<Media>(`api/media/${id}`);
  }

  loadSupportedVersions() {
    return this.http.get<any>('api/media/supportedversions').subscribe((versions) => {
      this.SUPPORTED_VERSIONS = versions;
    });
  }

  startTranscode(id: number) {
    this.http.post(`api/media/${id}/transcode`, { resolution: '320x180' }).subscribe(() => {
      alert('Task started!');
    });
  }

  deleteTranscode(id: number) {
    return this.http.delete(`api/media/${id}/transcode`);
  }

  listPosters(id: number): Observable<string[]> {
    return this.http.get<string[]>(`api/image/${id}/poster`)
  }

  uploadPosters(id: number, posters: File[]): Observable<string[]> {
    const formData: FormData = new FormData();
    posters.forEach((file: File) => {
      formData.append('posters', file, file.name);
    });
    return this.http.post<string[]>(`api/image/${id}/poster/upload`, formData);
  }
}
