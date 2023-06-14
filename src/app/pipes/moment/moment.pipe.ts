import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
