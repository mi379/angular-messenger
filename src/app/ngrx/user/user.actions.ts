import { User } from './user.reducer'
import { createAction,props } from '@ngrx/store'

export const setUser = createAction(
  "Set User",props<User>()
)

export const resetUser = createAction(
  "Reset",
)
