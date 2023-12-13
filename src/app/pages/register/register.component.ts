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

  onSubmit(){
    this.signUpStage = 'profile'
  }
}

type Ctx = 'account' | 'profile'

interface Account{
  username:string, 
  password:string, 
  matchPwd:string
}
