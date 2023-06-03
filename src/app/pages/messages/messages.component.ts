import ObjectId from 'bson-objectid'
import { Observable,Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { trigger,state,style } from '@angular/animations';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit } from '@angular/core';
import { Session } from '../../ngrx/auth/auth.reducer'
import { RequestService,State,Get,RequestState,Post } from '../../services/request/request.service'


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

  currentUser : User | undefined

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  onFetchStateChange : Subscription | undefined

  sendState : State<New> = this.request.createInitialState<New>()

  fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

  fetchFunction : Get = this.request.get<Message[]>({state:this.fetchState})
  
  observableUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

  sendFunction : Post<Send> = this.request.post<New,Send>({
    cb: result => console.log(result),
    state:this.sendState,
    path:"message/new",
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

  sendNewMessage(value:string,sender:string,authorization:string){
    
    var headers:HttpHeaders = new HttpHeaders({
      authorization
    })

    
    var groupId:string = this.state['groupId']
    var accept:string = this.params['_id']

    var _id = ObjectId().toHexString()

    (this.messages as Message[]).push({
      _id,
      sender,
      accept,
      value,
      send:false
    })


    var sendParam:Send = {
      groupId,
      accept,
      value
    }

    this.sendFunction(
      sendParam,{
        headers
      }
    )
  }

  onSubmit(newMessageValue:string,event:Event){
    var user:User = this.currentUser as User
    var jwt = `Bearer ${user.authorization}`

    this.sendNewMessage(

      newMessageValue,
      user._id,
      jwt
    )
    
    event.preventDefault()
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
  	this.preFetch = this.observableUser.subscribe(state => {
      var jwt:string = `Bearer ${state.authorization}`

      this.currentUser = state
      
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

type New = Send & {
  _id:string
  sender:string,
  __v:number
}

interface Send{
  accept:string,
  value:string,
  groupId:string
}

interface Message {
  _id:string,
  sender:string,
  accept:string,
  value:string
  send:boolean,
}

interface Reducers {
  auth:Session,
  user:User
}

interface WHState{
  profile:Profile
  groupId:string
}

