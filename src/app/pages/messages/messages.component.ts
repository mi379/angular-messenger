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

  fetchErrorMessage : string | undefined

  preFetch : Subscription | undefined

  fetchState : any = this.request.createInitialState<any>()

  fetchFunction : Get = this.request.get<any>({state:this.fetchState})
  
  currentUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

  fetchAllMessage(authorization:string){
    var path:string = `message/all/${this.params['_id']}`

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
      
      this.fetchAllMessage(
        jwt
      )
    })
  }
}

interface Reducers {
  auth:Session,
  user:User
}

interface WHState{
  profile:Profile
}