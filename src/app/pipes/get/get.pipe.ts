import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'get'
})

export class GetPipe implements PipeTransform {

  transform(x:boolean):boolean{
    return x
  }

}