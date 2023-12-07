import { Pipe, PipeTransform } from '@angular/core';
import { Message,IncomingMessage } from '../../pages/home/home.component'

@Pipe({
  name: 'toMessage'
})
export class ToMessage implements PipeTransform {

  transform(message:IncomingMessage):Message{
    return message as Message
  }

}
