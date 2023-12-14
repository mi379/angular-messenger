import { Component,OnInit,AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent{
  counter : number = 0
  
  ch:BroadcastChannel = new BroadcastChannel(
    'message'
  )
  
  openNewTab(url:string,path:string){
    window.open(
      `https://${url}/${path}`
    )
  }
  
  onClick(){
    this.openNewTab(
      'angular-messenger.vercel.app',
      'oauth'
    )
  }

  constructor(){
    this.ch.onmessage = e => {
      this.counter = this.counter + 1
      console.log('ok')
    }
  }
  
}

