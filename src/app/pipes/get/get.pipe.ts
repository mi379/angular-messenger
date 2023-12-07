import { Pipe, PipeTransform } from '@angular/core';
import { Search } from '../../pages/search/search.component'
import { Sender } from '../../pages/home/home.component'

@Pipe({
  name: 'get'
})

export class GetPipe implements PipeTransform {

  transform({message,unreadCounter,...x}:Search):Profile{
    return x as Profile
  }

}