import { Types } from 'mongoose';
import { Component,Input} from '@angular/core';
import { Message } from '../../pages/home/home.component'
import { Sender } from '../../pages/home/home.component'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() user: Sender | undefined
  @Input() message : Message | undefined
  @Input() _id : string | undefined
  @Input() onSearch : boolean | undefined

  newId():string{
    return (new Types.ObjectId()).toString()
  }
  
  
  unreadCounter():boolean{
    if(this.message && this.onSearch){
      var message:Message = this.message as Message
      var {unreadCounter,sender}:Message = message
     
      return message?.unreadCounter > 0 && sender.usersRef === this._id
        ? true
        : false
    }
    
    if(this.message && this.onSearch){
      var message: Message = this.message as Message
      var { unreadCounter, sender }: Message = message
      
      return message?.unreadCounter > 0 && sender.usersRef !== String(this._id) ?
        true :
        false
    }
    
    if(!this.message){
      return false
    }
  }
  
}

/*
type Compare = Profile & {
  usersRef:string
}
*/
