import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Pipe({
    name: 'fileImage',
    standalone: true
})
export class FileImagePipe implements PipeTransform {

    transform(file: File): Observable<any> {
        const ret = new Subject<any>();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt) => {
            ret.next(reader.result);
            // ret.complete();
        }
        return ret.asObservable();
    }

}
