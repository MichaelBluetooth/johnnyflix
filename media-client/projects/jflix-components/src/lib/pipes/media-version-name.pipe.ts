import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mediaVersionName',
  standalone: true
})
export class MediaVersionNamePipe implements PipeTransform {

  transform(name: string[]): string {
    return 'Optimize for ' + name.join(', ').replace(/,(?=[^,]+$)/, ', and') + ' devices';
  }

}
