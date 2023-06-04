import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isFailedSend'
})
export class IsFailedSendPipe implements PipeTransform {

  transform(value:string,args:string[]):boolean {
    return args.includes(
      value
    )
  }

}
