import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JflixMediaService } from '../../services/media.service';
import { Observable, Subject } from 'rxjs';
import { Media } from '../../models/media.model';
import { EditMediaModalComponent, MediaData } from './edit-media-modal/edit-media-modal.component';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class JflixMediaFormService {

  constructor(private mediaSvc: JflixMediaService, private http: HttpClient, private componentFactoryResolver: ComponentFactoryResolver) { }

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

  initEdit(media: any): FormGroup {
    const form = this.createForm(false);
    form.controls['name'].setValue(media.name);
    form.controls['description'].setValue(media.description);
    form.controls['releaseYear'].setValue(media.releaseYear);
    form.controls['tags'].setValue(media.tags.join(', '));

    const hrsRaw = media.duration / 3.6e+6;
    const hrs = Math.floor(hrsRaw);
    let min = ((hrsRaw - hrs) * 60);
    if (min < 1) {
      min = Math.round(min * 100) / 100;
    } else {
      min = Math.ceil(min);
    }
    form.controls['durationHrs'].setValue(hrs);
    form.controls['durationMin'].setValue(min);

    form.controls['versions'].setValue(
      media.versions?.map(version => {
        return {
          name: version.name,
          optimize: version.optimize
        }
      })
    );

    return form;
  }

  initNew(): FormGroup {
    const form = this.createForm(true);
    form.controls['versions'].setValue(
      this.mediaSvc.SUPPORTED_VERSIONS?.map((version, idx) => {
        return {
          name: version.name,
          optimize: idx === 0
        }
      })
    );
    return form;
  }

  private createForm(includeFile: boolean): FormGroup {
    let form: FormGroup = new FormGroup({      
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      releaseYear: new FormControl(null),
      durationHrs: new FormControl(null),
      durationMin: new FormControl(null),
      tags: new FormControl(null),
      versions: new FormControl(null)
    });

    if(includeFile){
      form.addControl('file', new FormControl(null, Validators.required));
    }
    return form;
  }
}
