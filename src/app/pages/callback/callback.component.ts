import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { RequestService } from '../../services/request/request.service'

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent{
  platform:string = this.activatedRoute.snapshot.params['platform']
  
  code:string|null = this.activatedRoute.snapshot.queryParamMap.get(
    'code'
  )
  
  ch: BroadcastChannel = new BroadcastChannel(
    'message'
  )
  
  
  
  constructor(
    private activatedRoute: ActivatedRoute
  ){}
  
  
}
