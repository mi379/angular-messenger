import { Component,Input } from '@angular/core';
import { Profile } from '../../ngrx/user/user.reducer'
import { Sender } from '../../pages/home/home.component'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() detail : Detail | undefined
}

type Detail = Profile & {
  usersRef:string
}