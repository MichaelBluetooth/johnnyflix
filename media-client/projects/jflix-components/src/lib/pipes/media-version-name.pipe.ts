import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mediaVersionName',
  standalone: true
})
export class MediaVersionNamePipe implements PipeTransform {

  transform(name: string): string {
    switch (name) {
      case 'small':
        return 'Optimize for Small Devices';
      case 'medium':
        return 'Optimize for Medium Devices';
      case 'large':
        return 'Optimize for Large Devices';
      default:
        return name;
    }
  }

}
