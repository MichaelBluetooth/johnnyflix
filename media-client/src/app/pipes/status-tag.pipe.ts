import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusTag',
  standalone: true
})
export class StatusTagPipe implements PipeTransform {

  transform(status: string): string {
    switch (status) {
      case 'active':
        return 'tag is-info';
      case 'completed':
        return 'tag is-success';
      case 'failed':
        return 'tag is-danger';
      case 'delayed':
      case 'paused':
      case 'waiting':
        return 'tag is-warning'
      default:
        return "tag is-info"
    }
  }

}
