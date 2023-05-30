import { Component,Input } from '@angular/core';
import { Message } from '../../pages/home/home.component'
import { User } from '../../ngrx/user/user.reducer'


@Component({
  selector: 'app-recently-messages',
  templateUrl: './recently-messages.component.html',
  styleUrls: ['./recently-messages.component.css']
})
export class RecentlyMessagesComponent {
  @Input() _id : string | undefined
  @Input() content!: Message[]
}
