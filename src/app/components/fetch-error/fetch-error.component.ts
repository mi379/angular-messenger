import { Component,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fetch-error',
  templateUrl: './fetch-error.component.html',
  styleUrls: ['./fetch-error.component.css']
})
export class FetchErrorComponent {
  @Output("retry") fetchRetry = new EventEmitter()

  retry(){
  	this.fetchRetry.emit()
  }
}
