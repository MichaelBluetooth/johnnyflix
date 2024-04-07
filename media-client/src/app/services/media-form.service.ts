import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MediaService } from './media.service';

@Injectable({
  providedIn: 'root'
})
export class MediaFormService {

  constructor(private mediaSvc: MediaService, private fb: FormBuilder) { }

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
