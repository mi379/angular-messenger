import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { RequestService } from './services/request/request.service'
import { AuthService } from './services/auth/auth.service'
import { authReducer } from './ngrx/auth/auth.reducer'
import { userReducer } from './ngrx/user/user.reducer'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MagnifyingGlassComponent } from './components/icons/magnifying-glass/magnifying-glass.component'
import { CardComponent } from './components/card/card.component';
import { SearchComponent } from './pages/search/search.component'
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RootComponent } from './pages/root/root.component';  
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { ArrowPathComponent } from './components/icons/arrow-path/arrow-path.component';
import { BarComponent } from './components/icons/bar/bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InvalidComponent } from './pages/invalid/invalid.component';
import { PowerComponent } from './components/icons/power/power.component';
import { FetchErrorComponent } from './components/fetch-error/fetch-error.component';
import { RecentlyMessagesComponent } from './components/recently-messages/recently-messages.component';
import { MessageComponent } from './components/message/message.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ComparePipe } from './pipes/compare/compare.pipe';
import { ParsePipe } from './pipes/parse/parse.pipe';
import { ArrowLeftComponent } from './components/icons/arrow-left/arrow-left.component';
import { CheckComponent } from './components/icons/check/check.component';
import { ExclamationCircleComponent } from './components/icons/exclamation-circle/exclamation-circle.component';
import { MomentPipe } from './pipes/moment/moment.pipe';
import { CameraComponent } from './components/icons/camera/camera.component';
import { PaperAirplaneComponent } from './components/icons/paper-airplane/paper-airplane.component';

@NgModule({
  declarations: [
    SearchComponent, 
    CardComponent, 
    LoginComponent,
    HomeComponent,
    RootComponent,
    ArrowPathComponent,
    BarComponent,
    SidebarComponent,
    LoadingComponent,
    NavbarComponent,
    InvalidComponent,
    PowerComponent,
    FetchErrorComponent,
    RecentlyMessagesComponent,
    MessageComponent,
    MessagesComponent,
    ComparePipe,
    ParsePipe,
    ArrowLeftComponent,
    CheckComponent,
    ExclamationCircleComponent,
    MomentPipe,
    CameraComponent,
    PaperAirplaneComponent,
    MagnifyingGlassComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      auth:authReducer,
      user:userReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge:25
    })
  ],
  providers: [
    AuthService,
    RequestService,
    AuthenticationGuard
  ],
  bootstrap: [
    RootComponent
  ]
})
export class AppModule { }
