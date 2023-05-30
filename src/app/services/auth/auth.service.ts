import { Router } from '@angular/router'
import { logOptions } from '../../ngrx/auth/auth.actions'
import { User } from '../../ngrx/user/user.reducer'
import { setUser,resetUser } from '../../ngrx/user/user.actions'
import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService<Reducers> {
  constructor(private store:Store<Reducers>,private router:Router){}

  login(signedIn:boolean,user:User){
  	this.store.dispatch(
      logOptions({
        signedIn
      })
    )
    
    this.store.dispatch(
      setUser(user)
    )

  	this.redirect(
      '/'
  	)
  }

  logout(signedIn:boolean){
  	this.store.dispatch(
      logOptions({
        signedIn
      })
  	)

  	this.store.dispatch(
      resetUser()
  	)

  	this.redirect(
      '/login'
  	)
  }

  redirect(path:string){
  	this.router.navigateByUrl(
      path
  	)
  }
}
