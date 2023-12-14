import { Component,OnInit,AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements AfterViewInit{
  counter : number = 0
  
  ch:BroadcastChannel = new BroadcastChannel(
    'message'
  )
 
  onMessage = this.ch.onmessage = (e: any) => {
    this.counter = this.counter+1
  }
  
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

  ngAfterViewInit(){
    
  }
}

