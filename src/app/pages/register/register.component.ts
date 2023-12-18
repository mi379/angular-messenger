import { Component,OnInit,AfterViewInit } from '@angular/core';
import { State,Get,RequestService } from '../../services/request/request.service'
import { AuthService } from '../../services/auth/auth.service'
import { Reducers } from '../login/login.component'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  FB:any
  
  oauthInfoChannel:BroadcastChannel = new BroadcastChannel('message')
  
  gAuthState:State<string> = this.request.createInitialState<string>()
  
  gAuth:Get = this.request.get<string>({
    state:this.gAuthState, 
    cb: r => window.open(r), 
    failedCb: e => alert(e)
  })
  
  runGAuth(gAuthPath:string){
    this.gAuth(gAuthPath,{
      responseType:'text'
    })
  }

  ngOnInit(){
    this.oauthInfoChannel.onmessage = e => {
      this.auth.login(true,e.data) 
      console.log(e) 
    }
  }

  
  checkLoginState() {           
    FB.getLoginStatus(function(response:any) {
      
    });
  }
  
  constructor(
    private request:RequestService, 
    private auth:AuthService<Reducers>
  ){}
  
}

