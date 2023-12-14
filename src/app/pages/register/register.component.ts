import { Component } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  signUpStage:Ctx = 'account'
  
  account:Account = {
    username:'', 
    password:'', 
    matchPwd:''
  }

  onClick(){
    window.open(
      'https://angular-messenger.vercel.app/oauth'
    )
  }
}

type Ctx = 'account' | 'profile'

interface Account{
  username:string, 
  password:string, 
  matchPwd:string
}
