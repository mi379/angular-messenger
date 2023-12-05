import { Store } from '@ngrx/store'
import { HttpHeaders } from '@angular/common/http'
import { Observable,BehaviorSubject,Subscription } from 'rxjs'
import { User } from '../../ngrx/user/user.reducer'
import { Reducers,IncomingMessage } from '../home/home.component'
import { ViewChild,ElementRef,Component,OnInit,AfterViewInit } from '@angular/core';
import { State,Get,RequestService } from '../../services/request/request.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements AfterViewInit {
 
  authorization:string | HttpHeaders = ''
 
  @ViewChild('query') query! : ElementRef

  user:Observable<User>= this.store.select((state:Reducers) => {
    return state.user
  })
  
  subscription:Subscription = this.user.subscribe((u:User) => {
    this.authorization = `Bearer ${u.authorization}`
    
    this.authorization = new HttpHeaders({
      authorization:this.authorization
    }) 
  })
  
  queryString: Query<Target> = new BehaviorSubject<Target>(null)
  
  state:State<Search[]> = this.request.createInitialState<Search[]>()
  

  onQueryStringChange:Subscription = this.queryString.subscribe(t => {
    var headers:HttpHeaders = this.authorization as HttpHeaders
    var {value}:HTMLInputElement = t as HTMLInputElement
    
    var search = value.length > 0
      ? `user/search/${value}`
      : ''
   
    if (value.length > 0) {
      this.runSearch(
        search,
        headers
      )
    }
  }) 

  search:Get = this.request.get < Search[] > ({
    cb: result => alert(result),
    failedCb : err => alert("err"), 
    state: this.state,
  })
  
  runSearch(value,headers){
    this.search(value,{
      headers
    })
  }

  
  ngAfterViewInit(){
    this.query.nativeElement.focus();
  }
  
  constructor(
    private request:RequestService, 
    private store:Store<Reducers>
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


