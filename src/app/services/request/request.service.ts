import { Injectable } from '@angular/core';
import { BehaviorSubject,Observable,throwError } from 'rxjs'
import { timeoutWith } from 'rxjs/operators'
import { HttpEvent,HttpClient,HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})


// export class RequestService{
// 	constructor(private httpClient:HttpClient){}

// 	server : string = "https://nestjs-api-production-f720.up.railway.app"
	

// 	get<Result>(config:RequestConfig<Result>):{run:Get<Result>,retry:Retry<Result>} {
//     var retry : Retry<Result> = undefined

// 		var run = (path:string,options?:any):Run<Result> => {
// 			retry = () => (this.get<Result>)(config).run(
//         path,options
// 			)
			
// 			return this.httpClient.get<Result>(
// 				`${this.server}/${path}`,
// 				options
// 			)
// 		}
		
// 		return {
// 			run,
// 			retry
// 		}
// 	}
// }


export class RequestService {

	constructor(private httpClient:HttpClient){}

	server  = "https://nestjs-api-production-f720.up.railway.app"

	get<Result>(config:RequestConfig<Result>) : Get {

		var recursive = (this.get<Result>).bind(this)

		var retryFunction = () => { /* run retry */ }

		var timeout = new Error("error timeout.....")
 
    var error = (response:HttpErrorResponse) => {
			var message:string = response.message
			
			if(config.failedCb) config.failedCb(
        message
			)
			
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

	
		return (path:string,options?:any) => {

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

		var getBody : (() => Body) | undefined = undefined

    var timeout = new Error("error timeout.....")

    var error = (response:HttpErrorResponse) => {
      var message = response.message

			if(config.failedCb) config.failedCb(
				(getBody as () => Body)()
			)
			
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

			getBody = () => body
      
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


export type Post<Body> = (body:Body,options?:any) => void

export type State<Result> = BehaviorSubject<RequestState<Result>>

export type Get = (path:string,options?:any) => void

type Retry<Result> = (() => Run<Result>) | undefined

type Run<Result> = Observable<HttpEvent<Result>>

interface RequestConfig<Result>{
	cb?:(result:Result) => void,
	failedCb?:(params:any)=>void,
	state:State<Result>,
	path?:string
}

export interface RequestState<Result>{
	retryFunction?:() => void,
	running:boolean,
	error?:string,
	result?:Result
}
