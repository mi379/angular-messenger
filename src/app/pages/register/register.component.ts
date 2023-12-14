import { Component,OnInit} from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  ch:BroadcastChannel = new BroadcastChannel(
    'message'
  )
  .addEventListener(
    'message', 
    this.onMessage.bind(this)
  )
  
  onMessage(message){
    alert('hello')
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
  
  ngOnInit(){
    
  }
}

