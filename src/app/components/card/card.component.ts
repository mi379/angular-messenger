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
  
  unreadCounter({unreadCounter,sender}:Message):boolean{
    if(unreadCounter>0 && sender.usersRef !== this._id){
      return true
    }
    else{
      return false
    }
  }
}

type Compare = Profile & {
  usersRef:string
}
