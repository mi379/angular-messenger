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
    this.ch.onmessage = (e) => {
      alert('harusnya bisa')
    }
    
    
    this.ch.postMessage(
      'halo bro'
    )
  }
}