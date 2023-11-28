import { Component,Input} from '@angular/core';
import { Profile } from '../../ngrx/user/user.reducer'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() user: User | undefined
  @Input() message: Compare | undefined
}

type Compare = Profile & {
  usersRef:string
}
