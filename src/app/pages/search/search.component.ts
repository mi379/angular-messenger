import { BehaviorSubject,Subscription } from 'rxjs'
import { ViewChild,ElementRef,Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements AfterViewInit {
  @ViewChild('query') query! : ElementRef
  
  queryString: Query = new BehaviorSubject('')

  onQueryStringChg: this.queryString.subscribe(
    target => this.search(
      target as HTMLInputElement
    ) 
  )

  search(keyword:string){
    alert({keyword}) 
  }
  
  ngAfterViewInit(){
    this.query.nativeElement.focus();
  }
}

type Query = BehaviorSubject<EventTarget>
