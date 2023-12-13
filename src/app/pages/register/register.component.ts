import { Component } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  account:Account = {
    username:'', 
    password:'', 
    matchPwd:''
  }
}

interface Account{
  username:string, 
  password:string, 
  matchPwd:string
}
