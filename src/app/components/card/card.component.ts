import { Types } from 'mongoose';
import { Component,Input} from '@angular/core';
import { Last } from '../../pages/search/search.component'
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
    var showUnreadCounter:boolean = false
      
    
    if(this.message && this.onSearch){
      let message:Last = this.message as unknown as Last
      
      if(message.unreadCounter > 0 && String(message.sender) === this._id){
        showUnreadCounter = true
      }
    }
    
    if(this.message && !this.onSearch){
      let message: Message = this.message as Message
     
      if(message?.unreadCounter > 0 && sender.usersRef !== String(this._id)){
        showUnreadCounter = true
      }
    }
    
    return showUnreadCounter
  }
  
}

/*
type Compare = Profile & {
  usersRef:string
}
*/
