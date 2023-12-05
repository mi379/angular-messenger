import { Store } from '@ngrx/store'
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

export class SearchComponent implements OnInit,AfterViewInit {
 
  authorization:string = ''
 
  @ViewChild('query') query! : ElementRef

  xxx:Observable<User>= this.store.select((state:Reducers) => {
    return state.user
  })
  
  queryString: Query<Target> = new BehaviorSubject<Target>(null)
  
  state:State<Search[]> = this.request.createInitialState<Search[]>()

  onQueryStringChange:Subscription = this.queryString.subscribe(
    target => {
      var {value}:HTMLInputElement = (
        target as HTMLInputElement
      ) 

      if(value.length > 0){
        alert(this.authorization)
      }
        
    }
  )
  
  search: Get = this.request.get < Search[] > ({
    cb: result => alert("success"),
    state: this.state,
  })
  
  user:Subscription | undefined = undefined

  
  ngOnInit(){
    this.user = this.xxx.subscribe(u => {
      this.authorization = u.authorization
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


