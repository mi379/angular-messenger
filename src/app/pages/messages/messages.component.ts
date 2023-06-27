import { Store } from '@ngrx/store'
import { io,Socket } from 'socket.io-client'
import { Observable,timeoutWith,throwError } from 'rxjs'
import { trigger,state,style } from '@angular/animations';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,HostListener,OnInit } from '@angular/core';
import { Session } from '../../ngrx/auth/auth.reducer'


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  animations: [
    trigger(
      'isLast',[
        state('last',style({
          marginBottom:'16px'
        }))
      ]
    )
  ]
})
export class MessagesComponent implements OnInit{

  server:string = process.env['NG_APP_SERVER']

  _id:string = this.route.snapshot.params['_id']
  
  messages : (Message & Status)[] | undefined = undefined

  fetchErrorMessage : string | undefined = undefined

  state:{profile:Profile,groupId:string} = window.history.state

  failedSendDetail:{sendAt:number,retryFunction:() => void}[] = []
  
  currentUser:Observable<User>|User = this.store.select(state => {
    return state.user
  })

  fetchPath:string = `${this.server}/message/all/${this._id}`

  fetchRetry:() => void =  () => {} // fetch retry function 

  failedSendList:number[] = []

  internetConnected:boolean = true

  socket:Socket = io(
    this.server
  )
  .on(
    'connect',
    this.onConnect.bind(
      this
    )
  )
  .on(
    'newMessage',
    this.onNewMessage.bind(
      this
    )
  )
  .on(
    'read',
    this.onReadByOther.bind(
      this
    )
  )
  
  constructor(
    private httpClient:HttpClient,
    private route:ActivatedRoute,
    private store:Store<Reducers>,
    private router:Router,
  ){}

  fetchAllMessage(authorization:string){

    if(this.fetchErrorMessage){
      this.fetchErrorMessage = undefined
    }

    // remove error to retry http request
    
    var headers:HttpHeaders = new HttpHeaders({
      authorization:`Bearer ${authorization}`
    })

    this.fetchRetry = () => this.fetchAllMessage(
      authorization
    )

    var timeout:Observable<never> = throwError(
      new Error("timeout")
    )
    
    this.httpClient.get<Message[]>(
      this.fetchPath,{
        headers
      }
    )
    .pipe(
      timeoutWith(
        5000,
        timeout
      )
    )
    .subscribe({
      next:result => this.onSuccessFetch(
        result
      ),
      complete:() => {
        this.fetchErrorMessage = undefined
        // remove error on success request
      },
      error:message => {
        this.fetchErrorMessage = message
        // display error message on error
      }
    })

    // set http request and provide retry function

  }

  onSuccessFetch(result:Message[]){

    var filter1:Message[] = result.filter(
      message => message.sender === this._id
    )

    var filter2:Message[] = filter1.filter(
      message => message.read === false
    )

    filter2.forEach(this.update.bind(this))

    // sorted by send time (first to last)

    var sorted:Message[] = result.sort((prev,next) => {
      return prev.sendAt > next.sendAt ? 1 : -1
    })

    this.messages = sorted.map(message => {
      return {
        ...message,
        send:true
      }
    })


    
  }

  update(message:Message){
    var {authorization}:User = this.currentUser as User
    
    var headers:HttpHeaders = new HttpHeaders({
      authorization:`Bearer ${authorization}`
    })

    var path:string = `${this.server}/message/new`

    var _id:string = message._id as string

    var updateParameter:Read = {
      _id,
      read:true
    }
    
    this.httpClient.put<Read>(
      path,updateParameter,{
        headers
      }
    )
    .subscribe({
      next:r => console.log(
        r
      ),
      error:e => console.log(
        e
      )
    })
  }

  goBack(){

    this.router.navigateByUrl(
      '/'
    )

  }

  onSuccessSend(sendObj:Message){
    var current = this.messages as (Message & Status)[]

    var filter:(Message & Status)[] = current.filter(
      _filter => _filter.sendAt === sendObj.sendAt
    )

    var updatedList:(Message&Status)[] = current.map(
      message => {
        return filter.includes(message)
          ? {
            ...message,
            send:true,
            _id:sendObj._id
          }
          :message
      }
    )

    this.messages = updatedList

  }

  sendNewMessage(authorization:string,sendParameter:Send){

    this.failedSendList = this.failedSendList.filter(
      sendAt => sendAt !== sendParameter.sendAt
    )

    this.failedSendDetail = this.failedSendDetail.filter(
      detail => detail.sendAt != sendParameter.sendAt
    )

    var headers:HttpHeaders = new HttpHeaders({authorization})

    var retryFunction:() => void = () => this.sendNewMessage(
      authorization,sendParameter
    )

    var timeout:Observable<never> = throwError(new Error(""))
    
    var path:string = `${this.server}/message/new`

    this.httpClient.post<Message>(
      path,sendParameter,{
        headers
      }
    )
    .pipe(
      timeoutWith(
        25000,
        timeout
      )
    )
    .subscribe({
      next:result => this.onSuccessSend(
        result
      ),
      error: err => {
        setTimeout(() => {
          this.failedSendList = [
            ...this.failedSendList,
            sendParameter.sendAt
          ]
          this.failedSendDetail = [
            ...this.failedSendDetail,{
              sendAt:sendParameter.sendAt,
              retryFunction
            }
          ]
        },5000)
      }
    })

  }

  resend(sendAt:number){

    var [{retryFunction}] = this.failedSendDetail.filter(
      detail => detail.sendAt === sendAt
    )

    retryFunction()

  }

  onSubmit(value:string){
    
    var {authorization} = this.currentUser as User
    var jwtString:string = `Bearer ${authorization}`

    var current:(Message & Status)[] = this.messages as (
      Message & Status
    )[]

    var _id:string = (this.currentUser as User)._id

    var groupId:string = this.state.groupId

    var sendAt:number = Date.now()
    
    var sendParameter:Send = {
      accept:this._id,
      read:false,
      groupId,
      value,
      sendAt
    }

    this.messages = [
      ...current,{
        ...sendParameter,
        sender:_id,
        send:false,
      }
    ];

    //(document.getElementById("target") as HTMLElement).scrollIntoView()

    this.sendNewMessage(
      jwtString,
      sendParameter
    )

    // this.messages = [
    //   ...current,{
    //     ...sendParam,
    //     sender:_id,
    //     send:false
    //   }
    // ]

  }
  
  ngOnInit(){

    (this.currentUser as Observable<User>).subscribe(state => {
      this.currentUser = state

      this.fetchAllMessage(
        state
        .authorization,
      )
    })


  }

  onConnect(){

    console.log('connected.....');
    
  }

  onNewMessage(message:Message){
    
    var currentUserId:string = (this.currentUser as User)._id
    var currentList:(Message & Status)[] = (this.messages as (Message & Status)[])

    if(message.sender === this._id && message.accept === currentUserId){

      var {authorization}:User = this.currentUser as User

      var path:string = `${this.server}/message/new`

      var headers:HttpHeaders = new HttpHeaders({
        authorization:`Bearer ${authorization}`
      })

      var _id:string = message._id as string

      var updateParameter:Read = {
        _id,
        read:true
      }

      this.httpClient.put<Read>(
        path,updateParameter,{
          headers
        }
      )
      .subscribe({
        next:r => console.log(
          r
        ),
        error:e => console.log(
          e
        )
      })
      
      this.messages = [
        ...currentList,{
          ...message,
          read:true,
          send:true
        }
      ];

    }
    
  }

  onReadByOther(_id:string){
    var current:(Message & Status)[] = this.messages as (Message & Status)[]

    var updatedList:(Message & Status)[] = current.map(
      message => {
        return message._id as string === _id
          ? {
            ...message,
            read:true
          }
          :message
      }
    )

    this.messages = updatedList
  }

  @HostListener('window:online',['$event']) onConnected(event:Event){
  	this.internetConnected = true
  }

  @HostListener('window:offline',['$event']) onOffline(event:Event){
  	this.internetConnected = false
  }

  onChange(event:Event){
    var target:HTMLInputElement = event.target as HTMLInputElement
    var files:FileList = target.files as FileList
    var reader:FileReader = new FileReader()

    reader.onload = (e:ProgressEvent<FileReader>) => {
      var r:FileReader = e.target as FileReader
      var result:string = r.result as string
      
      console.log(result)
    }

    reader.readAsDataURL(
      files[0]
    )
  }

}



// export class MessagesComponent implements OnInit {

//   fetchAllMessage(authorization:string,_id:string){
//     var path:string = `message/all/${_id}`

//     var headers:HttpHeaders = new HttpHeaders({
//       authorization
//     })

//     this.fetchFunction(
//       path,{headers}
//     )
//   }

//   ngOnInit(){
//     this.preFetch = this.observableUser.subscribe(state => {
//       var jwt:string = `Bearer ${state.authorization}`

//       this.currentUser = state
      
//       this.fetchAllMessage(
//         jwt,this.params[
//           '_id'
//         ]
//       )
//     })
    
//   }

//   fetchRetry(state?:RequestState<Message[]> | undefined){
//   	if(state) (state.retryFunction as () => void)()

//   	else{
//   		this.fetchRetry(
//         this
//         .fetchState
//         .value
//   		)
//   	}
//   }

//   onSubmit(value:string){
//     var {authorization,_id}:User = this.currentUser as User
//     var authorizationString = `Bearer ${authorization}`

//     var current:(Message&Status)[] = this.messages as (
//       Message & Status
//     )[]

//     var headers:HttpHeaders = new HttpHeaders({
//       authorization:authorizationString
//     })

//     var groupId:string = this.state.groupId

//     var accept:string = this.params['_id']

//     var sendAt:number = Date.now()

//     var sendParam:Send = {
//       accept,
//       groupId,
//       sendAt,
//       value
//     }

//     this.sendFunction(
//       sendParam,{
//         headers
//       }
//     )

//     this.messages = [
//       ...current,{
//         sender:_id,
//         send:false,
//         accept,
//         groupId,
//         sendAt,
//         value,
//       }
//     ]
   
//   }

//   goBack (){
//     this.router.navigateByUrl(
//       '/'
//     )
//   }

//   constructor(
//     private route:ActivatedRoute,
//     private store:Store<Reducers>,
//     private request:RequestService,
//     private httpClient:HttpClient,
//     private router:Router
//   ){}

//   state:WHState = window.history.state
//   profile:Profile = this.state.profile
//   params:Params = this.route.snapshot.params

//   messages: (Message & Status)[] | undefined

//   currentUser : User | undefined

//   failedSendList : number[] = []

//   failedSendDetail : Send[] = []

//   fetchErrorMessage : string | undefined
  
//   preFetch : Subscription | undefined

//   sendState : State<Message> = this.request.createInitialState<Message>()
    
//   fetchState : State<Message[]> = this.request.createInitialState<Message[]>()

//   @HostListener('window:online',['$event']) onBeforeUnload(event:Event){
//     var token:string = (this.currentUser as User).authorization

//     var server:string = process.env['NG_APP_SERVER']

//     var authorization:string = `Bearer ${token}`

//     var headers:HttpHeaders = new HttpHeaders({
//       authorization
//     })

//     var next = (response:Message) => {
//       console.log(
//         response
//       )
//     }

//     if(this.failedSendDetail.length > 0 ){
//       this.failedSendDetail.forEach(
//         detail => this.httpClient.post<Message>(
//           `${server}/message/new`,
//           detail ,
//           {headers}
//         )
//         .subscribe({
//           next
//         })
//       )
//     }
//   }

//   sendFunction : Post<Send> = this.request.post<Message,Send>({
//     state:this.sendState,
//     path:"message/new",
//     cb:result => this.onSuccessSend(
//       (this.messages as (Message & Status)[]).filter(
//         message => message.sendAt = result.sendAt
//       ),
//       result._id as string
//     ),
//     failedCb : body => {
//       this.failedSendList = [
//         ...this.failedSendList,
//         (body as Send).sendAt
//       ]
//       this.failedSendDetail = [
//         ...this.failedSendDetail,
//         body as Send
//       ]
//     }
//   })

//   onSuccessSend([filter]:(Message & Status)[],_id:string){
//     var current:(Message & Status)[] = this.messages as (Message & Status)[]

//     var updatedList:(Message & Status)[] = current.map(
//       message => {
//         return current.includes(filter)
//           ? {
//             ...message,
//             send:true,
//             _id:_id
//           }
//           : message
//       }
//     )

//     this.messages = updatedList
//   }

//   fetchFunction : Get = this.request.get<Message[]>({
//     state:this.fetchState,
    
//     failedCb : message => {
//       this.fetchErrorMessage = message as string
//     },

//     cb: result =>  {
//       this.fetchErrorMessage = undefined
//       this.messages = result.map(message => {
//         return {
//           ...message,
//           send:true
//         }
//       })
//     } 
//   })
  
//   observableUser : Observable<User> = this.store.select((state:Reducers) => {
//     return state.user
//   })

// }


interface Message {
  _id?:string,
  sender:string,
  accept:string,
  value:string
  sendAt:number,
  groupId:string,
  read:boolean,
  description:string,
  contentType:string
}

interface Send{
  groupId:string,
  accept:string,
  value:string,
  sendAt:number,
  read:boolean,
  description:string,
  contentType:string
}

interface Status{
  send:boolean
}

interface Reducers {
  auth:Session,
  user:User
}

interface Read{
  _id:string,
  read:boolean
}