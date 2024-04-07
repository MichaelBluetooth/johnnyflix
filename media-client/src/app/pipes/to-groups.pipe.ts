import { Pipe, PipeTransform } from '@angular/core';
import { toGroupsOfSize } from '../utils/to-groups-of-size';

@Pipe({
  name: 'toGroups',
  standalone: true
})
export class ToGroupsPipe implements PipeTransform {
  transform(items: any[], groupSize: number): any[] {
    return toGroupsOfSize(items, groupSize);
  }
}
