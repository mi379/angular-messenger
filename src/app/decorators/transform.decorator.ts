export function bearer(target:any,key:string,descriptor:PropertyDescriptor){
  let originalMethod = descriptor.value

  descriptor.value = function(...args:any[]){
    var stringAuth = args[0].authorization
    var newStrAuth = `Bearer ${stringAuth}`
    args[0].authorization = newStrAuth
  	
  	return originalMethod.apply(
       this,args
    )
  }
}