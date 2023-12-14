import { Component } from '@angular/core';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent {
  postMessage(){
    window.opener.postMessage(
      'halo bro register'
    )
  }
}