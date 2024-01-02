import { Store } from '@ngrx/store'
import { Session } from '../../ngrx/auth/auth.reducer'
import { Observable,BehaviorSubject } from 'rxjs'
import { Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn:'root'
})
export class AuthenticationGuard  {
  constructor(private router:Router,private store:Store<{auth:Session}>){}

  authReducer:Observable<Session> = this.store.select((state) => state.auth)

  canActivated:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Restricted{
    this.authReducer.pipe(take(1)).subscribe((auth) => {
      if(!auth.signedIn && state.url !== '/login'){

        this.router.navigateByUrl(
          '/login'
        )

        this.canActivated.next(
          false
        )
      }
      else{
        this.canActivated.next(
          true
        )
      }

      if(auth.signedIn && state.url === '/login'){
        this.router.navigateByUrl(
          '/'
        )

        this.canActivated.next(
          false
        )
      }
    })

    return this.canActivated.value
  }

  
  
}

type Restricted = 
  boolean | 
  UrlTree | 
  Observable<boolean | UrlTree> | 
  Promise<boolean | UrlTree>

