import { Injectable,OnInit } from '@angular/core';
import { Subject,Observable,BehaviorSubject,throwError } from 'rxjs'
import { catchError,timeoutWith } from 'rxjs/operators'
import { HttpEvent,HttpClient,HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class RequestService {

	constructor(private httpClient:HttpClient){}

	server : string = process.env['NG_APP_SERVER']

	get<Result>(config:RequestConfig<Result>) : Get {

		var recursive = (this.get<Result>).bind(this)

		var retryFunction = () => { /* run retry */ }

		var timeout = new Error("error timeout.....")
 
    var error = (response:HttpErrorResponse) => {
      var message = response.message
			
			config.state.next({
				running:false,
				error:message,
				retryFunction
			})
    }

    var next = (response:HttpEvent<Result>) => {
    	var result = response as Result

			if(config.cb) config.cb(
				result
			)

			config.state.next({
				running:false,
				result
			})
    }

	
		return (path?:string,options?:any) => {

			config.state.next({running:true})

			retryFunction = () => recursive(
        config
			)
			(
        path,
        options
			)

      
			this.httpClient.get<Result>(
        this.createPath(path),
        options
			)
			.pipe(
        timeoutWith(
          5000,throwError(
            timeout
          )
        )
      )
			.subscribe({
				error,
				next
			}) 
		}
	}


	createPath(path:string | undefined) : string {
		return `${this.server}/${path}`
	}

	createInitialState<Result>() : State<Result> {
		return new BehaviorSubject<RequestState<Result>>({
			running:false
		})
	}

	post<Result,Body>(config:RequestConfig<Result>) : Post<Body> {
  	var recursive = (this.post<Result,Body>).bind(
  		this
  	)

    var retryFunction = () => { /* run retry */ }

    var timeout = new Error("error timeout.....")

    var error = (response:HttpErrorResponse) => {
      var message = response.message
			
			config.state.next({
				running:false,
				error:message,
				retryFunction
			})  
    }

    var next = (response:HttpEvent<Result>) => {
    	var result = response as Result

			if(config.cb) config.cb(
				result
			)

			config.state.next({
				running:false,
				result
			})
    }

    return (body:Body,options?:any) => {

    	config.state.next({
    		running:true
    	})

      retryFunction = () => recursive(
        config
			)
			(
        body,
        options
			)

      
			this.httpClient.post<Result>(
        this.createPath(
        	config.path
        ),
        body,
        options
			)
			.pipe(
        timeoutWith(
          5000,throwError(
            timeout
          )
        )
      )
			.subscribe({
				error,
				next
			}) 

    }
  
  }

}


type Post<Body> = (body:Body,options?:any) => void

export type State<Result> = BehaviorSubject<RequestState<Result>>

export type Get = (path?:string,options?:any) => void

interface RequestConfig<Result>{
	cb?:(result:Result) => void,
	state:State<Result>,
	path?:string
}

export interface RequestState<Result>{
	retryFunction?:() => void,
	running:boolean,
	error?:string,
	result?:Result
}