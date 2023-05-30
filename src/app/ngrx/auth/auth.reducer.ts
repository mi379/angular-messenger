import { logOptions } from './auth.actions'
import { createReducer,on,ActionReducer,createAction } from '@ngrx/store';

var state = JSON.parse(localStorage.getItem("ngrxLocalStorage") as string)

function onAction(state:Session,{type,...payload}:Payload):Session{
  return payload
}

export const authReducer = createReducer(
  state?.auth ?? {signedIn:false},
  on(
  	logOptions,
    onAction
  )
)


type Payload = Session & {
  type:string
}

export interface Session{
  signedIn:boolean
}
