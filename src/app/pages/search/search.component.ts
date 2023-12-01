import { Observable } from 'rxjs'
import { ViewChild,ElementRef,Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements AfterViewInit {
  @ViewChild('query') query! : ElementRef
  
  queryString:Observable<string> = new Observable<string>('')
  
  ngAfterViewInit(){
    this.query.nativeElement.focus();
  }
}
