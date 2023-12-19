import { Component,OnInit,AfterViewInit } from '@angular/core';
import { State,Get,RequestService,Post } from '../../services/request/request.service'
import { AuthService } from '../../services/auth/auth.service'
import { User } from '../../ngrx/user/user.reducer'
import { Reducers } from '../login/login.component'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  
  oauthInfoChannel:BroadcastChannel = new BroadcastChannel('message')
  
  gAuthState:State<string> = this.request.createInitialState<string>()

  fbAuthState:State<User> = this.request.createInitialState<User>() 

  fbLoginNext : (r:any) => void = this.afterFbAuth.bind(this)

  scope:{scope:string} = {scope:'public_profile,email'}
  
  gAuth:Get = this.request.get<string>({
    state:this.gAuthState, 
    cb: r => window.open(r), 
    failedCb: e => alert(e)
  })

  fbAuth:Post<Create> = this.request.post<User,Create>({
    cb:r => this.auth.login(true,r),
    failedCb: e => alert(e), 
    state:this.fbAuthState, 
    path:"oauth/facebook/signup"
  }) 

  toStr<T>(object:T):string{
    return JSON.stringify(
      object
    ) 
  }
  
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
    var responseStatus:FbResponse = response as FbResponse

    if(responseStatus.status === "connected"){
      var fields:string = 'id,first_name'
      fields = `${fields},last_name`
      fields = `${fields},picture`
      
      FB.api(
        `/me?fields=${fields}`, 
        this.onFbLoggedIn.bind(this) 
      ) 
    }

    //alert(JSON.stringify(response)) 
  }

  loginWithFacebook(){           
    FB.login(
      this.fbLoginNext,{
        ...this.scope
      }
    )    
  }

  createUserOrCheckIfExist(body:Create){
    this.fbAuth(
      body
    ) 
  }

  onFbLoggedIn({picture,...r}:Fields){
    this.createUserOrCheckIfExist({
      oauthReference:r.id, 
      firstName:r.first_name, 
      surname:r.last_name, 
      profileImage:picture.data.url
    }) 
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

interface Fields{
  id:string, 
  first_name:string, 
  last_name:string, 
  picture:Picture 
}

interface Picture{
  data:{
    url:string
  }
}

interface Create{
  oauthReference:string,
  profileImage:string,
  firstName:string, 
  surname:string, 
}
