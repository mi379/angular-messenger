import { Observable,Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit } from '@angular/core';
import { Session } from '../../ngrx/auth/auth.reducer'
import { RequestService,State,Get,RequestState } from '../../services/request/request.service'




@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  state:WHState = window.history.state
  profile:Profile = this.state.profile
  params:Params = this.route.snapshot.params

  messages: any

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  onFetchStateChange : Subscription | undefined

  fetchState : State<any> = this.request.createInitialState<any>()

  fetchFunction : Get = this.request.get<any>({state:this.fetchState})
  
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
      
      this.fetchAllMessage(this.params['_id'],jwt)
    })

    this.onFetchStateChange = this.fetchState.subscribe(
      state => {
        this.messages = state.result
        this.fetchErrorMessage  = state.error
      }
    )
  }
}

interface Reducers {
  auth:Session,
  user:User
}

interface WHState{
  profile:Profile
}