import { Store } from '@ngrx/store'
import { Observable,Subscription } from 'rxjs'
import { Session } from '../../ngrx/auth/auth.reducer'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { RequestService,State,Get,RequestState } from '../../services/request/request.service'
import { AuthService } from '../../services/auth/auth.service'
import { HttpHeaders } from '@angular/common/http';
import { ViewChild,ElementRef,Component,OnDestroy,OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:  ['./home.component.css'],
})

export class HomeComponent implements OnInit, OnDestroy {

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  failedSendList : string[] = []

  @ViewChild('content') content!: ElementRef

  dataId : string = this.content.nativeElemnt.getAttribute(
    'data-id'
  )

  onFetchStateChange: Subscription | undefined

  recentlyMessages : Message[] | undefined

  fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

  fetchFunction : Get = this.request.get<Message[]>({state:this.fetchState})

  currentUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

  fetchRecentlyMessages(authorization:string){      
    var path:string = "message/recently"

    var headers:HttpHeaders = new HttpHeaders({
      authorization
    })

    this.fetchFunction(
      path,{headers}
    )
  }

  fetchRetry(state?:RequestState<Message[]> | undefined){
  	if(state) (state.retryFunction as () => void)()

  	else{
  		this.fetchRetry(
        this
        .fetchState
        .value
  		)
  	}
  }

  logout(){
    this.auth.logout(false)
  }

  ngOnInit(){
    this.onFetchStateChange = this.fetchState.subscribe(
      state => {
        this.recentlyMessages = state.result
        this.fetchErrorMessage  = state.error
      }
    )

    this.preFetch = this.currentUser.subscribe(state => {
      var jwt:string = `Bearer ${state.authorization}`
      
      this.fetchRecentlyMessages(
        jwt
      )
    })
  }

  unsubscribe(subscriptions:(Subscription|undefined)[]){
    var origin : Subscription[] = subscriptions.map(
      el => el as Subscription
    )

    origin.forEach((subscription:Subscription) => {
      subscription.unsubscribe()
    })
  }

  ngOnDestroy(){
  	this.unsubscribe([
      this.preFetch,
      this.onFetchStateChange
    ])
  }

  constructor(
    private store:Store<Reducers>,
    private request:RequestService,
    private auth:AuthService<Reducers>
  ){}
}

export interface Message{
  _id:string,
  sender:Sender,
  value:string,
  accept:Accept,
  groupId:string
}

export type Sender = Profile & {
  usersRef:string
}

type Accept = Profile & {
  usersRef:string
}

interface Reducers{
  auth:Session,
  user:User
}


