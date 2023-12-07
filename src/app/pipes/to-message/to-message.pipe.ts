import { Pipe, PipeTransform } from '@angular/core';
import { Message,IncomingMessage } from '../../pages/home/home.component'

@Pipe({
  name: 'toMessage'
})
export class ToMessagePipe implements PipeTransform {

  transform(message:IncomingMessage):any{
    return false
  }

}
