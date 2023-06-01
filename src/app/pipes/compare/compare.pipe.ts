import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '../../ngrx/user/user.reducer'
import { Message } from '../../pages/home/home.component'

@Pipe({
  name: 'compare'
})
export class ComparePipe implements PipeTransform {

  transform(value:Message,_id:_Id): Result {
    var ref:string = value.sender.usersRef
    

    return ref === _id as string
      ? value.accept
      : value.sender
  }

}

type Params = [_Id,string]

type _Id = string | undefined

type Result = Profile & {
  usersRef:string
}