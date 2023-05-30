import { setUser,resetUser } from './user.actions'
import { createReducer,on,ActionReducer,createAction } from '@ngrx/store';

var state = JSON.parse(localStorage.getItem("ngrxLocalStorage") as string)

export const userReducer:ActionReducer<User|null> = createReducer(
  state?.user ?? {
  	user:null
  },
  on(
  	setUser,
  	set
  ),
  on(
    resetUser,
    reset
  )
);

function set(state:User|null,{type,...payload}:Payload):User{
  return payload
}

function reset(state:User|null):null{
  return null
}

type Payload = User & {
  type:string
}

export interface Profile{
  surname:string,
  profileImage:string,
  firstName:string,
}

export interface User{
  _id:string,
  profile:Profile,
  authorization:string
}
