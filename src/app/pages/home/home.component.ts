import { Store } from '@ngrx/store'
import { io,Socket } from 'socket.io-client'
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

  _id : string = ''

  server:string = process.env['NG_APP_SERVER'] as string

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  failedSendList : string[] = []


  onFetchStateChange: Subscription | undefined

  recentlyMessages : Message[] | undefined

  fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

  fetchFunction : Get = this.request.get<Message[]>({state:this.fetchState})

  currentUser : Observable<User> = this.store.select((state:Reducers) => {
    this._id = state.user._id
    return state.user
  })

  socket:Socket = io(
    this.server
  )
  .on(
    'newMessage', 
    this.onNewMessage.bind(
      this
    ) 
  ) 
  
  onNewMessage(message:Message){
    alert(
      JSON.stringify
        message
      )
    ) 
  }
  
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
    this.socket.disconnected() 
  
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
  sender:Sender,
  value:string,
  accept:Accept,
  groupId:string,
  sendAt:number, 
  read:boolean, 
  contentType:string, 
  description?:string, 
  unreadCounter:number, 
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


