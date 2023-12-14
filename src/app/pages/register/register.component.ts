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
  
  openNewTab(url,path){
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
    this.ch.onmessage = (event) => {
      alert('halo bro')
    }
  }
}

