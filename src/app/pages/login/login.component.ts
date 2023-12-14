import { BehaviorSubject } from 'rxjs'
import { Component } from '@angular/core';
import { User } from '../../ngrx/user/user.reducer'
import { Session } from '../../ngrx/auth/auth.reducer'
import { AuthService } from '../../services/auth/auth.service'
import { RequestService } from '../../services/request/request.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginState = this.request.createInitialState<User>()

  loginInfo:FakeUser = {username:'',password:''}
  
  loginFunction = this.request.post<User,FakeUser>({
    cb: user => this.auth.login(true,user),
    state: this.loginState,
    path: "user/login"
  })

  login(fakeLoginInfo:FakeUser){
    this.loginFunction(
      fakeLoginInfo
    )
  }

  openNewTab(){
    window.open(
      'https://angular-messenger.vercel.app/register'
    ) 
  }

  constructor(
    private auth:AuthService<Reducers>,
    private request:RequestService
  ){}

}

interface FakeUser{
  username:string,
  password:string
}

interface Reducers{
  auth:Session,
  user:User
}
