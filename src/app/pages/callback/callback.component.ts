import { Component } from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent {
  ch:BroadcastChannel = new BroadcastChannel(
    'message'
  )
  
  postMessage(){
    ch.postMessage(
      'halo bro register'
    )
  }
}