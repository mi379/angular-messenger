import { BehaviorSubject } from 'rxjs'
import { ViewChild,ElementRef,Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements AfterViewInit {
  @ViewChild('query') query! : ElementRef
  
  queryString: Query = new BehaviorSubject('')
  
  
  ngAfterViewInit(){
    this.query.nativeElement.focus();
  }
}

type Query = BehaviorSubject<any>