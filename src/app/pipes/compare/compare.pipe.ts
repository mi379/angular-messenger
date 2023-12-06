import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '../../ngrx/user/user.reducer'
import { IncomingMessage } from '../../pages/home/home.component'
import { Message } from '../../pages/home/home.component'

@Pipe({
  name: 'compare'
})
export class ComparePipe implements PipeTransform {

  transform(value:Message|IncomingMessage,_id:_Id,onSearch): Result {
    if(!onSearch){
      var message:Message = value as Message
      var ref: string = message.sender.usersRef
      
      
      return ref === _id as string ?
        value.accept :
        value.sender
    }
    else{
      var message: Message = value as IncomingMessage
      var ref: string = message.sender.usersRef
      
      
      return ref === _id as string ?
        value.accept :
        value.sender
    }
  }

}

type Params = [_Id,string]

type _Id = string | undefined

type Result = Profile & {
  usersRef:string
}