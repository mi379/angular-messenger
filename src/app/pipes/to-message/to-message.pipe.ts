import { Pipe, PipeTransform } from '@angular/core';
import { Message,IncomingMessage } from '../../pages/home/home.component'

@Pipe({
  name: 'toMessage'
})
export class InputPipe implements PipeTransform {

  transform(message:IncomingMessage):Message{
    return message as Message
  }

}
