import { Component,Input} from '@angular/core';
import { User } from '../../ngrx/user/user.reducer'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() user: User | undefined
  @Input() message: string | undefined
}
