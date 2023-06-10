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

  fetchAllMessage(authorization:string,_id:string){
    var path:string = `message/all/${_id}`

    var headers:HttpHeaders = new HttpHeaders({
      authorization
    })

    this.fetchFunction(
      path,{headers}
    )
  }

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

  onSubmit(value:string){
    var {authorization,_id}:User = this.currentUser as User
    var authorizationString = `Bearer ${authorization}`

    var current:(Message&Status)[] = this.messages as (
      Message & Status
    )[]

    var headers:HttpHeaders = new HttpHeaders({
      authorization:authorizationString
    })

    var groupId:string = this.state.groupId

    var accept:string = this.params['_id']

    var sendAt:number = Date.now()

    var sendParam:Send = {
      accept,
      groupId,
      sendAt,
      value
    }

    this.sendFunction(
      sendParam,{
        headers
      }
    )

    this.messages = [
      ...current,{
        sender:_id,
        send:false,
        accept,
        groupId,
        sendAt,
        value,
      }
    ]
   
  }

  goBack (){
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

  state:WHState = window.history.state
  profile:Profile = this.state.profile
  params:Params = this.route.snapshot.params

  messages: (Message & Status)[] | undefined

  currentUser : User | undefined

  fetchErrorMessage : string | undefined
  
  preFetch : Subscription | undefined

  sendState : State<Message> = this.request.createInitialState<Message>()
    
  fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

  sendFunction : Post<Send> = this.request.post<Message,Send>({
    state:this.sendState,
    path:"message/new",
    cb:result => this.onSuccessSend(
      (this.messages as (Message & Status)[]).filter(
        message => message.sendAt = result.sendAt
      ),
      result._id as string
    )
  })

  onSuccessSend([filter]:(Message & Status)[],_id:string){
    var current:(Message & Status)[] = this.messages as (Message & Status)[]

    var updatedList:(Message & Status)[] = current.map(
      message => {
        return current.includes(filter)
          ? {
            ...message,
            send:true,
            _id:_id
          }
          : message
      }
    )

    this.messages = updatedList
  }

  fetchFunction : Get = this.request.get<Message[]>({
    state:this.fetchState,
    
    failedCb : message => {
      this.fetchErrorMessage = message as string
    },

    cb: result =>  {
      this.fetchErrorMessage = undefined
      this.messages = result.map(message => {
        return {
          ...message,
          send:true
        }
      })
    } 
  })
  
  observableUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

}

interface Message {
  _id?:string,
  sender:string,
  accept:string,
  value:string
  sendAt:number,
  groupId:string
}

interface Send{
  groupId:string,
  accept:string,
  value:string,
  sendAt:number
}

interface Status{
  send:boolean
}

interface Reducers {
  auth:Session,
  user:User
}

interface WHState{
  profile:Profile
  groupId:string
}

