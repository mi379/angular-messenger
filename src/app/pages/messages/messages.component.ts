import { Router } from '@angular/router'
import { Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit } from '@angular/core';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  state:State = window.history.state
  profile:Profile = state.profile

  ngOnInit(){
  	
  }
}

interface State{
  profile:Profile
}