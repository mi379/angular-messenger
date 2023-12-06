import { Pipe, PipeTransform } from '@angular/core';
import { Search,Profile } from '../../pages/search/search.component'

@Pipe({
  name: 'get'
})

export class GetPipe implements PipeTransform {

  transform({message,unreadCounter,...other}:Search):Profile{
    return other as Profile
  }

}