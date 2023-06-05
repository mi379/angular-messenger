import ObjectId from 'bson-objectid'
import { Observable,Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { trigger,state,style } from '@angular/animations';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit,HostListener } from '@angular/core';
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

  failedSendListId: string[] = []

  failedSendListDetail : Message[] = []

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  onFetchStateChange : Subscription | undefined

  sendState : State<New> = this.request.createInitialState<New>()

  fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

  fetchFunction : Get = this.request.get<Message[]>({state:this.fetchState})
  
  observableUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

  @HostListener('window:online',['$event']) onOnline(event:Event){

    (this.failedSendListDetail as Message[]).forEach(
      message => this.retrySend([
        message.accept,
        message.value,
        message._id
      ])
    )
  }

  retrySend([accept,value,_id]:[string,string,string]){
    var user:User = this.currentUser as User
    var groupId:string = this.state['groupId']
    var jwt:string = `Bearer ${user.authorization}`

    var headers:HttpHeaders = new HttpHeaders({
      authorization:jwt
    })

    var sendParam:Send = {
      groupId,
      accept,
      value,
      _id
    }

    this.sendFunction(
      sendParam,{
        headers
      }
    )
  }

  sendFunction : Post<Send> = this.request.post<New,Send>({
    cb: ({_id}) => this.updateSendStatus(
      (this.messages as Message[]).filter(
        message => message._id === _id
      )
    ),
    failedCb: body => this.onFailedSend(
      body as Message
    ),
    state:this.sendState,
    path:"message/new",
  })

  onFailedSend(message:Message){
    this.failedSendListDetail.push(
      message
    )
    this.failedSendListId.push(
      message._id
    )
  }

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

    var _id:string = ObjectId().toHexString()
    
    var accept:string = this.params['_id']


    this.addToMessageList({
      send:false,
      sender,
      accept,
      value,
      _id,
    })

    var sendParam:Send = {
      groupId,
      accept,
      value,
      _id
    }

    this.sendFunction(
      sendParam,{
        headers
      }
    )
  }

  updateSendStatus(filter:Message[]){
    
    (this.messages as Message[]).forEach(
      message => {
        if(filter.includes(message)){
          message.send = true
        }
      }
    )
    
    var [message]:Message[] = filter

    this.failedSendListId = this.failedSendListId.filter(
      _id => _id !== message._id
    )

    this.failedSendListDetail = this.failedSendListDetail.filter(
      failed => failed._id !== message._id
    )
    
  }

  addToMessageList(newMessage : Message){
    (this.messages as Message[]).push(
      newMessage
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
  sender:string,
  __v:number
}

interface Send{
  accept:string,
  value:string,
  groupId:string,
  _id:string
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

