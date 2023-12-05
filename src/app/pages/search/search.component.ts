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

export class SearchComponent implements AfterViewInit {
  @ViewChild('query') query! : ElementRef

  authorization : string | undefined = undefined
  
  queryString: Query<Target> = new BehaviorSubject<Target>(null)
  
  state:State<Search[]> = this.request.createInitialState<Search[]>()
  
  currentUser:Observable<User> = this.store.select(state => {
    this.authorization = state.user._id

    return state.user
  })

  _search:Get = this.request.get<Search[]>({
    cb:result => alert(JSON.stringify(result)), 
    state:this.state,
  }) 

  onQueryStringChg:Subscription = this.queryString.subscribe(
    target => {
      var {value}:HTMLInputElement = (
        target as HTMLInputElement
      ) 

      alert(
        this.authorization
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


