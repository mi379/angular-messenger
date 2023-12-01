import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parse'
})
export class InputPipe implements PipeTransform {

  transform(target: EventTarget): HTMLInputElement {
   return target as HTMLInputElement
  }

}
