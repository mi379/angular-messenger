import { Component,Input} from '@angular/core';
import { Message,IncomingMessage } from '../../pages/home/home.component'
import { Sender } from '../..pages/home/home.component'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() user: Sender | undefined
  @Input() message : Message | undefined
  @Input() _id : string | undefined
  /*
  unreadCounter():boolean{
    var message:Message = this.message as Message
    var {unreadCounter,sender}:Message = message

    return unreadCounter > 0 && sender.usersRef !== this._id
      ? true
      : false
  }
  */
}

/*
type Compare = Profile & {
  usersRef:string
}
*/
