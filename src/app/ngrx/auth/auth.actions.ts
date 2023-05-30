import { Session } from './auth.reducer'
import { createAction,props } from '@ngrx/store'

export const logOptions = createAction(
  "Login/Logout",props<Session>()
)
