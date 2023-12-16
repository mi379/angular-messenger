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
    cb: r => window.open(r)
  }) 

  ngOnInit(){
    this.oauthInfoChannel.onmessage = e => {
      // handle succes oauth event
    }
  }
  
  constructor(
    private request:RequestService
  ){}
  
}

