import { Store } from '@ngrx/store'
import { io,Socket } from 'socket.io-client'
import { storage } from '../../firebase/storage.firebase'
import { Observable,timeoutWith,throwError } from 'rxjs'
import { trigger,state,style } from '@angular/animations';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router,Params } from '@angular/router'
import { User,Profile } from '../../ngrx/user/user.reducer'
import { Component,ViewChild,ElementRef,HostListener,OnInit,OnDestroy} from '@angular/core';
import { Session } from '../../ngrx/auth/auth.reducer'
import { uploadBytes,ref,StorageReference,getDownloadURL,UploadResult } from 'firebase/storage'


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
export class MessagesComponent implements OnInit,OnDestroy{
  messageText:string = ''

  typing:boolean = false

  server:string = process.env['NG_APP_SERVER'] as string

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

  uploadPreview:boolean = false
  uploadPreviewImage:string = ''
  
  file:File|undefined = undefined

  uploadRef:StorageReference = ref(storage,'images')

  failedToUploadFile:{detail:Send,file:File}[] = []

  @ViewChild('target') target! : ElementRef

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
  .on(
    'typingTrue', 
    this.onTypingTrue.bind(
      this
    ) 
  ) 
  .on(
    'typingFalse', 
    this.onTypingFalse.bind(
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

    // remove from failed list if it is actually a retry to send

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
      description:'',
      contentType:'text',
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

    this.messageText = ''
    
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

  ngOnDestroy(){
    console.log('leave...') 
    this.socket.disconnect() 
  }

  onConnect(){

    console.log('connected.....');
    
  }

  onNewMessage(message:Message){
    console.log('event ini berjalan saat ada pesan baru') 
    
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
      
      this.uploadPreviewImage = result
      this.uploadPreview = true

    }

    this.file = files[0]

    reader.readAsDataURL(
      files[0]
    )


  }

  closePreview(){
    this.uploadPreview = false
  }

  async uploadAndSend(sendParameter:Send,file:File|undefined){
    var {authorization}:User = this.currentUser as User
    var jwtString:string = `Bearer ${authorization}`
    
    try{
      var result:UploadResult = await uploadBytes(
        this.uploadRef,file as File
      )

      var url:string = await getDownloadURL(
        result.ref
      )

      this.sendNewMessage(jwtString,{
        ...sendParameter,
        value:url
      })
    }
    catch(error:unknown){
      this.failedSendList = [
        ...this.failedSendList,
        sendParameter.sendAt
      ]
      this.failedToUploadFile = [
        ...this.failedToUploadFile,{
          detail:sendParameter,
          file:file as File
        }
      ]
    }
  }

  async submitImage(description:string){
    var current:(Message & Status)[] = this.messages as (Message & Status)[]

    
    var _id:string = (this.currentUser as User)._id

    var groupId:string = this.state.groupId

    var sendAt:number = Date.now()
    
    var sendParameter:Send = {
      value:this.uploadPreviewImage,
      description:'',
      contentType:'image',
      accept:this._id,
      read:false,
      groupId,
      sendAt
    }

    
    this.messages = [
      ...current,{
        ...sendParameter,
        sender:_id,
        send:false,
      }
    ];

    this.uploadAndSend(
      sendParameter,
      this.file
    )

    this.uploadPreview = false
  }

  resendImage(sendAt:number){
    var filter = this.failedToUploadFile.filter(
      failed => failed.detail.sendAt === sendAt
    )

    if(filter.length > 0 ){
      var [failed] = filter
      this.uploadAndSend(
        failed.detail,
        failed.file
      )
    }
    else{
      var [{retryFunction}] = this.failedSendDetail.filter(
        detail => detail.sendAt === sendAt
      )
  
      retryFunction()
    }
  }

  isValid(message:string){
    var regex = /^\s*$/;
    return !regex.test(
      message
    ) 
  }

  onKeyDown(){
    var _id:string = (this.currentUser as User)._id
    this.socket.emit(
      'typingTrue', 
      _id
    )
  }

  onKeyUp(){ 
    var _id:string = (this.currentUser as User)._id
    this.socket.emit(
      'typingFalse',
      _id
    )
  }

  onTypingTrue(_id:string){
    if(_id === this._id){
      this.typing = true
    }
  }

  onTypingFalse(_id:string){
    if(_id === this._id){
      this.typing = false
    }
  }

}

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
