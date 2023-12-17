import { Store } from '@ngrx/store'
import { Router } from '@angular/router'
import { HttpHeaders } from '@angular/common/http'
import { User } from '../../ngrx/user/user.reducer'
import { Observable,BehaviorSubject,Subscription } from 'rxjs'
import { Sender,Message } from '../home/home.component'
import { Reducers,IncomingMessage } from '../home/home.component'
import { ViewChild,ElementRef,Component,OnInit,AfterViewInit } from '@angular/core';
import { State,Get,RequestService } from '../../services/request/request.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements AfterViewInit {
 
  _id:string = ''
  
  authorization:string | HttpHeaders = ''
 
  @ViewChild('query') query! : ElementRef
  
  result : Search[] | undefined = undefined

  user:Observable<User>= this.store.select((state:Reducers) => {
    return state.user
  })
  
  subscription:Subscription = this.user.subscribe((u:User) => {
    this._id = u._id
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
      this.search(
        search,
        {headers}
      )
    }
    else{
      this.result = undefined
    }
  }) 

  search:Get = this.request.get < Search[] > ({
    cb: r => this.onSuccessSearch(r),
    failedCb : err => alert("err"), 
    state: this.state,
  })
  
  onSuccessSearch(result:Search[]){
    var modifiedResult = result.map(r => {
      if(r.message){
        r.message.unreadCounter = r.unreadCounter
      }
      
      return r
    }) 
    
    this.result = modifiedResult
  }

  
  ngAfterViewInit(){
    this.query.nativeElement.focus();
  }
  
  toHome(){
    this.router.navigateByUrl(
       '/'
    )
  }
  
  constructor(
    private request:RequestService, 
    private store:Store<Reducers>, 
    private router:Router
  ){}
  
  
}

type Target = EventTarget | null
type Query<T> = BehaviorSubject<T>

export type Last = IncomingMessage & {
  unreadCounter:number
}

export type Search = Sender & {
  message?:Last, 
  unreadCounter:number
}


