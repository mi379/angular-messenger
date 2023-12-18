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
  
  oauthInfoChannel:BroadcastChannel = new BroadcastChannel('message')
  
  gAuthState:State<string> = this.request.createInitialState<string>()

  fbLoginNext : (r:any) => void = this.afterFbAuth.bind(this) 
  
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
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '247148138231326',
        xfbml      : true,                  
        version    : '18.0'
      });
    };
    this.oauthInfoChannel.onmessage = e => {
      this.auth.login(true,e.data) 
      console.log(e) 
    }
  }

  afterFbAuth(response:any){
    var responseStatus:FBResponse = response as FbResponse

    alert(responseStatus.status) 
  }

  loginWithFacebook(){       
    FB.login(
      this.
      fbLoginNext
    ) 
  }
  
  constructor(
    private request:RequestService, 
    private auth:AuthService<Reducers>
  ){}
}

interface FbResponse{
  status:string, 
  authResponse:AuthResponse
}

interface AuthResponse{
  accessToken:string, 
  expiresIn:string, 
  reauthorize_required_in:string, 
  signedRequest:string, 
  userID:string
}

