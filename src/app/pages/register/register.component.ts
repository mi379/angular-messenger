import { Component,OnInit} from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
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
  
  ngOnInit(){
    window.addEventListener('message',(e) => {
      alert('halo bro callback')
    })
  }
}

type Ctx = 'account' | 'profile'

interface Account{
  username:string, 
  password:string, 
  matchPwd:string
}
