import { take } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { Session } from '../../ngrx/auth/auth.reducer'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,OnInit,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})

export class RootComponent {
  server = process.env['NG_APP_SERVER']

  // constructor(private store:Store<{auth:Session,user:User}>){}

  // @HostListener('window:beforeunload',['$event']) onBeforeUnload(e:Event){
  // 	this.store.select(state => state).pipe(take(1)).subscribe(state => {
  // 	  localStorage.setItem("ngrxLocalStorage",JSON.stringify(state))
  // 	})
  // }
}
 
// save current state to storage on destroy,
// but how to make it does?
