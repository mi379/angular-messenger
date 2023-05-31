import { ActivatedRoute,Router,Params } from '@angular/router'
import { Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit } from '@angular/core';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  state:State = window.history.state
  profile:Profile = this.state.profile
  params:Params = this.route.snapshot.params

  goBack(){
    this.router.navigateByUrl(
      '/'
    )
  }

  constructor(
    private route:ActivatedRoute,
    private router:Router
  ){}

  ngOnInit(){
  	console.log(this.params['_id'])
  }
}

// interface Params {
//   _id: string
// }

interface State{
  profile:Profile
}