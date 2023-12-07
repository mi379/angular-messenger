import { Pipe, PipeTransform } from '@angular/core';
import { Last } from '../../pages/search/search.component'
import { Message } from '../../pages/home/home.component'

@Pipe({
  name: 'toMessage'
})
export class ToMessagePipe implements PipeTransform {

  transform(lastMessage:Last|undefined):Message{
    return lastMessage as Message
  }

}
