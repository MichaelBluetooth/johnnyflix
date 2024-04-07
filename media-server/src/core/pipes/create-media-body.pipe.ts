import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseCreateMediaBodyPipe implements PipeTransform {
  transform(value: {data: string}) {
    return JSON.parse(value.data);
  }
}