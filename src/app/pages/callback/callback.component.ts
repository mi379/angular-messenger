import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { RequestService } from '../../services/request/request.service'
import { AuthService } from '../../services/auth/auth.service'
import { User } from '../../ngrx/user/user.reducer'


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent implements OnInit{
  platform:string = this.activatedRoute.snapshot.params['platform']
  
  code:string|null = this.activatedRoute.snapshot.queryParamMap.get(
    'code'
  )

  callbackState = this.request.createInitialState<User>() 

  cbPage:string = `oauth/google/callback?code=${this.code}`

  callback = this.request.get<User>({
    cb:r => this.ch.postMessage(r), 
    state:this.callbackState, 
    failedCb:e => alert(e) 
  }) 
  
  ch: BroadcastChannel = new BroadcastChannel(
    'message'
  )
  
  ngOnInit(){
    this.callback(
      this.cbPage
    ) 
  }
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private request:RequestService, 
    private auth:AuthService
  ){}
  
  
}
