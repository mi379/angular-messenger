import { Component,Input} from '@angular/core';
import { Message } from '../../pages/home/home.component'
import { Profile } from '../../ngrx/user/user.reducer'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() user: Compare | undefined
  @Input() message : Message | undefined
  @Input() _id : string | undefined
  
  unreadCounter():boolean{
    var message:Message = this.message as Message
    var {unreadCounter,sender}:Message = message

    return unreadCounter > 0 && sender.usersRef !== this._id
      ? true
      : false
  }
}

type Compare = Profile & {
  usersRef:string
}
