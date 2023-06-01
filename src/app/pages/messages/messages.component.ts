import { Observable,Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit } from '@angular/core';
import { Session } from '../../ngrx/auth/auth.reducer'
import { RequestService,State,Get,RequestState } from '../../services/request/request.service'

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  animations: [
    trigger(
      'isLast',[
        state('last',style({
          marginBottom:'16px'
        }))
      ]
    )
  ]
})
export class MessagesComponent implements OnInit {
  state:WHState = window.history.state
  profile:Profile = this.state.profile
  params:Params = this.route.snapshot.params

  messages: Message[] | undefined

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  onFetchStateChange : Subscription | undefined

  fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

  fetchFunction : Get = this.request.get<Message[]>({state:this.fetchState})
  
  currentUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

  fetchAllMessage(authorization:string,_id:string){
    var path:string = `message/all/${_id}`

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

  goBack(){
    this.router.navigateByUrl(
      '/'
    )
  }

  constructor(
    private route:ActivatedRoute,
    private store:Store<Reducers>,
    private request:RequestService,
    private router:Router
  ){}

  ngOnInit(){
  	this.preFetch = this.currentUser.subscribe(state => {
      var jwt:string = `Bearer ${state.authorization}`
      
      this.fetchAllMessage(
        jwt,this.params[
          '_id'
        ]
      )
    })

    this.onFetchStateChange = this.fetchState.subscribe(
      state => {
        this.messages = state.result
        this.fetchErrorMessage  = state.error
      }
    )
  }
}

interface Message {
  _id:string,
  sender:string,
  accept:string,
  value:string
}

interface Reducers {
  auth:Session,
  user:User
}

interface WHState{
  profile:Profile
}