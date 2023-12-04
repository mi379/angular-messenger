

import { BehaviorSubject,Subscription } from 'rxjs'
import { User } from '../../ngrx/user/user.reducer'
import { IncomingMessage } from '../home/home.component'
import { ViewChild,ElementRef,Component, AfterViewInit } from '@angular/core';
import { State,RequestService } from '../../services/request/request.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements AfterViewInit {
  @ViewChild('query') query! : ElementRef
  
  queryString: Query<Target> = new BehaviorSubject<Target>(null)
  
  state:State<Search[]> = this.request.createInitialState<Result[]>()

  onQueryStringChg:Subscription = this.queryString.subscribe(
    target => {
      var {value}:HTMLInputElement = (
        target as HTMLInputElement
      ) 

      this.search(
        value
      ) 
        
    }
  )

  search(keyword:string){
    alert(keyword) 
  }
  
  ngAfterViewInit(){
    this.query.nativeElement.focus();
  }
  
  constructor(
    private request:RequestService
  ){}
  
  
}

type Target = EventTarget | null
type Query<T> = BehaviorSubject<T>

type Profile = Pick<User,"profile"> & {
  _id:string
}

type Search = Profile & {
  messages:IncomingMessage
}


