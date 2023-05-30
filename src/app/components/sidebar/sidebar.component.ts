import { BehaviorSubject } from 'rxjs'
import { Component,Input,Output,EventEmitter } from '@angular/core';
import { sidebarAnimation } from '../../animations/sidebar.animation'
import { trigger,state,style,animate,transition } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [sidebarAnimation]
})
export class SidebarComponent {
  @Input() sidebarState! : string
  @Output("logout") logout = new EventEmitter()
  @Output("toggle") toggle = new EventEmitter()
}
