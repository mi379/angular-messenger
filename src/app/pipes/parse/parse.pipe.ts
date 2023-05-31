import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '../../ngrx/user/user.reducer'
import { Detail } from '../../components/message/message.component'

@Pipe({
  name: 'parse'
})
export class ParsePipe implements PipeTransform {

  transform(detail: Detail|undefined): Profile {
    var {usersRef,...x} = detail as Detail

    return x
  }

}
