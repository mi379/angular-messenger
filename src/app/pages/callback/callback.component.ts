import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent{
  platform:string = this.activatedRoute.snapshot.params[
   'platform' 
  ]
  
  constructor(private activatedRoute: ActivatedRoute) {}
  
  
}