import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit } from '@angular/core';
import { Session } from '../../ngrx/auth/auth.reducer'




@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  state:State = window.history.state
  profile:Profile = this.state.profile
  params:Params = this.route.snapshot.params

  fetchErrorMessage : string | undefined
  
  currentUser : Observable<User> = this.store.select((state:Reducers) => {
    return state.user
  })

  goBack(){
    this.router.navigateByUrl(
      '/'
    )
  }

  constructor(
    private route:ActivatedRoute,
    private store:Store<Reducers>,
    private router:Router
  ){}

  ngOnInit(){
  	console.log(this.params['_id'])
  }
}

interface Reducers {
  auth:Session,
  user:User
}

interface State{
  profile:Profile
}