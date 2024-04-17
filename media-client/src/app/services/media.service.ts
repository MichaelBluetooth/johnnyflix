import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { EMPTY, Observable, Subject, tap } from 'rxjs';
import { Media } from '../models/media.model';
import { EditMediaModalComponent, MediaData } from '../components/edit-media-modal/edit-media-modal.component';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  SUPPORTED_VERSIONS = [];

  constructor(private http: HttpClient, private componentFactoryResolver: ComponentFactoryResolver) { }

  getMedia(id: number): Observable<Media> {
    return this.http.get<Media>(`api/media/${id}`);
  }

  loadSupportedVersions() {
    // return this.http.get<any>('api/media/supportedversions').subscribe((versions) => {
    //   this.SUPPORTED_VERSIONS = versions;
    // });
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

  editMedia(media: Media, container: ViewContainerRef) {
    const ret = new Subject<Media>();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditMediaModalComponent);
    const component = container.createComponent<EditMediaModalComponent>(componentFactory);
    component.instance.media = media;
    component.instance.close.subscribe(() => {
      container.remove();
      ret.complete();
    });
    component.instance.save.subscribe((userUpdatedMedia: MediaData) => {
      const formData = new FormData();
      userUpdatedMedia.posters?.forEach((file: File) => {
        formData.append('posters', file, file.name);
      });

      userUpdatedMedia.media.libraryId = media.libraryId;
      formData.append('data', JSON.stringify(userUpdatedMedia.media));

      this.http.put<Media>(`api/media/${media.id}`, formData).subscribe((newMedia: Media) => {
        container.remove();
        ret.next(newMedia);
      });
    });
    return ret;
  }

  uploadPosters(id: number, posters: File[]): Observable<string[]> {
    const formData: FormData = new FormData();
    posters.forEach((file: File) => {
      formData.append('posters', file, file.name);
    });
    return this.http.post<string[]>(`api/image/${id}/poster/upload`, formData);
  }

  createMedia(libraryId: number, container: ViewContainerRef) {
    const ret = new Subject<Media>();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditMediaModalComponent);
    const component = container.createComponent<EditMediaModalComponent>(componentFactory);
    component.instance.close.subscribe(() => {
      container.remove();
      ret.complete();
    });
    component.instance.save.subscribe((userUpdatedMedia: MediaData) => {
      const formData = new FormData();
      userUpdatedMedia.posters?.forEach((file: File) => {
        formData.append('posters', file, file.name);
      });
      formData.append('file', userUpdatedMedia.file, userUpdatedMedia.file.name);

      userUpdatedMedia.media.libraryId = libraryId;
      formData.append('data', JSON.stringify(userUpdatedMedia.media));

      this.http.post<Media>(`api/media`, formData).subscribe((newMedia: Media) => {
        container.remove();
        ret.next(newMedia);
      });
    });
    return ret;
  }
}
