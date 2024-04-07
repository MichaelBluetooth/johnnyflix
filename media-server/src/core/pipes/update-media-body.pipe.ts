import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseUpdateMediaBodyPipe implements PipeTransform {
  transform(value: {data: string}) {
    return JSON.parse(value.data);
  }
}