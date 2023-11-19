import { Component,Input,Output,EventEmitter } from '@angular/core';
import { User,Profile } from '../../ngrx/user/user.reducer'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() profile : Profile | undefined
  @Input() typing : boolean | undefined
}
