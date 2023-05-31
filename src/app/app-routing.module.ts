 import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { InvalidComponent } from './pages/invalid/invalid.component';
import { AuthenticationGuard } from './guards/authentication/authentication.guard'

const routes:Routes = [
  {
    path:'',
    component:HomeComponent,
    canActivate:[AuthenticationGuard]
  },
  {
    path:'login',
    component:LoginComponent,
    canActivate:[AuthenticationGuard]
  },
  {
    path:'messages/:_id',
    component:MessagesComponent,
    canActivate:[AuthenticationGuard]
  },
  {
    path:'**',
    component:InvalidComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
