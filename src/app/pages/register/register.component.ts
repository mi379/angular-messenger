import { Component,OnInit,AfterViewInit } from '@angular/core';
import { State,Get,RequestService } from '../../services/request/request.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  oauthInfoChannel:BroadcastChannel = new BroadcastChannel('message')
  
  gAuthState:State<string> = this.request.createInitialState<string>()
  
  gAuth:Get = this.request.get<string>({
    state:this.gAuthState, 
    cb: r => alert(r), 
    failedCb: e => alert(e)
  })
  
  runGauth(path){
    this.gAuth(path,{
      responseType:text
    })
  }

  ngOnInit(){
    this.oauthInfoChannel.onmessage = e => {
      // handle succes oauth event
    }
  }
  
  constructor(
    private request:RequestService
  ){}
  
}

