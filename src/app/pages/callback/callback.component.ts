import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent implements OnInit{
  ch:BroadcastChannel = new BroadcastChannel(
    'message'
  )
  
  postMessage(){
    this.ch.postMessage(
      'halo bro'
    )
  }
  
  ngOnInit(){
    this.ch.onMessage = (e) => {
      alert('harusnya bisa')
    }
  }
}