import { IFunctionPointer } from '../lib/interfaces';


const NSURLRequest_initWithURL_cachePolicy_timeoutInterval_ :IFunctionPointer = {
    name: '-[NSURLRequest initWithURL:cachePolicy:timeoutInterval:]',
    ptr: ObjC.classes.NSURLRequest['- initWithURL:cachePolicy:timeoutInterval:'].implementation,
    onEnter: function(args: InvocationArguments){
        var url = new ObjC.Object(args[2]).toString();
        if (url != 'nil'){
            send({
                type: 'network',
                message: {
                    timestamp: Date.now(),
                    symbol: this.name,
                    params: url,
                    tid: this.threadId
                }
            });
        }

    },
}

const NSURLRequest_HTTPBody :IFunctionPointer = {
    name: '-[NSURLRequest HTTPBody]',
    ptr: ObjC.classes.NSURLRequest['- HTTPBody'].implementation,
    onLeave: function(retval: NativePointer){
        var bodyObject = new ObjC.Object(retval);
        if (bodyObject.toString() != "nil" && bodyObject.length() > 0){
            send({
		        type: 'network',
		        message: {
                    timestamp: Date.now(),
                    symbol: this.name,
                    params: bodyObject.bytes().readCString(bodyObject.length()),
                    tid: this.threadId
                }
	        });
        }
    },
}

const NSMutableURLRequest_setHTTPBody :IFunctionPointer = {
    name: '-[NSURLRequest setHTTPBody]',
    ptr: ObjC.classes.NSMutableURLRequest['- setHTTPBody:'].implementation,
    onEnter: function(args: InvocationArguments){
        var bodyObject = new ObjC.Object(args[2]);
        if (bodyObject.toString() != "nil" && bodyObject.length() > 0){
            send({
		        type: 'network',
		        message: {
                    timestamp: Date.now(),
                    symbol: this.name,
                    params: `setHTTPBody: ${bodyObject.bytes().readCString(bodyObject.length())}`,
                    tid: this.threadId
                }
	        });
        }
    },
}

const NSURLRequest_HTTPMethod :IFunctionPointer = {
    name: '-[NSURLRequest HTTPMethod]',
    ptr: ObjC.classes.NSURLRequest['- HTTPMethod'].implementation,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'network',
		    message: {
		        timestamp: Date.now(),
		        symbol: this.name,
		        params: new ObjC.Object(retval).toString(),
		        tid: this.threadId
            }
	    });
    },
}

const NSURLRequest_allHTTPHeaderFields :IFunctionPointer = {
    name: '-[NSURLRequest allHTTPHeaderFields]',
    ptr: ObjC.classes.NSURLRequest['- allHTTPHeaderFields'].implementation,
    onLeave: function(retval: NativePointer){
        console.log(new ObjC.Object(retval).toString());
        /*send({
		    type: 'network',
		    message: {
		        timestamp: Date.now(),
		        symbol: this.name,
		        params: new ObjC.Object(retval).toString(),
		        tid: this.threadId
            }
	    });*/
    },
}

const NSURLSession_dataTaskWithURL_completionHandler_ :IFunctionPointer = {
    name: '-[NSURLSession dataTaskWithURL:completionHandler:]',
    ptr: ObjC.classes.NSURLSession['- dataTaskWithURL:completionHandler:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'network',
		    message: {
		        timestamp: Date.now(),
		        symbol: this.name,
		        params: new ObjC.Object(args[2]).toString(),
		        tid: this.threadId
            }
	    });
    },
}

/*const NSURLRequest_requestWithURL : IFunctionPointer = {
    name: '+[NSURLRequest requestWithURL:]',
    ptr: ObjC.classes.NSURLRequest['+ requestWithURL:'].implementation,
    onEnter: function(args: InvocationArguments){
        const ts = Date.now();
        send({
		    type: 'symbol:network',
		    message: {
		        timestamp: ts,
		        symbol: this.name,
		        params: new ObjC.Object(args[2]).toString(),
		        tid: this.threadId
            }
	    });
    },
};

const NSURLRequest_requestWithURL_cachePolicy_timeoutInterval : IFunctionPointer = {
    name: '+[NSURLRequest requestWithURL:cachePolicy:timeoutInterval:]',
    ptr: ObjC.classes.NSURLRequest['+ requestWithURL:cachePolicy:timeoutInterval:'].implementation,
    onEnter: function(args: InvocationArguments){
        const ts = Date.now();
        send({
		    type: 'symbol:network',
		    message: {
		        timestamp: ts,
		        symbol: this.name,
		        params: new ObjC.Object(args[2]).toString(),
		        tid: this.threadId
            }
	    });
    },
}

const NSMutableURLRequest_setValue_forHTTPHeaderField : IFunctionPointer = {
    name: '-[NSMutableURLRequest setValue:forHTTPHeaderField:]',
    ptr: ObjC.classes.NSMutableURLRequest['- setValue:forHTTPHeaderField:'].implementation,
    onEnter: function(args: InvocationArguments){
        var value = new ObjC.Object(args[2]).toString();
        if (value != 'nil'){
            var header = new ObjC.Object(args[3]).toString();
            send({
                type: 'symbol:network',
                message: {
                    timestamp: Date.now(),
                    symbol: this.name,
                    params: header + ": " + value,
                    tid: this.threadId
                }
            });
        }
    },
}

const NSMutableURLRequest_setHTTPBody : IFunctionPointer = {
    name: '-[NSMutableURLRequest setHTTPBody]',
    ptr: ObjC.classes.NSMutableURLRequest['- setHTTPBody:'].implementation,
    onEnter: function(args: InvocationArguments){
        var bodyObject = new ObjC.Object(args[2]);
        var body = bodyObject.bytes().readUtf8String(bodyObject.length());
        send({
            type: 'symbol:network',
            message: {
                timestamp: Date.now(),
                symbol: this.name,
                params: body,
                tid: this.threadId
            }
        });
    },
}

const NSMutableURLRequest_setHTTPMethod : IFunctionPointer = {
    name: '-[NSMutableURLRequest setHTTPMethod]',
    ptr: ObjC.classes.NSMutableURLRequest['- setHTTPMethod:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'symbol:network',
            message: {
                timestamp: Date.now(),
                symbol: this.name,
                params: new ObjC.Object(args[2]).toString(),
                tid: this.threadId
            }
        });
    },
}

const NSMutableURLRequest_setMainDocumentURL : IFunctionPointer = {
    name: '-[NSMutableURLRequest setMainDocumentURL]',
    ptr: ObjC.classes.NSMutableURLRequest['- setMainDocumentURL:'].implementation,
    onEnter: function(args: InvocationArguments){
        var url = new ObjC.Object(args[2]).toString();
        if (url != 'nil'){
            send({
                type: 'symbol:network',
                message: {
                    timestamp: Date.now(),
                    symbol: this.name,
                    params: url,
                    tid: this.threadId
                }
            });
        }
    },
}

const NSMutableURLRequest_setURL : IFunctionPointer = {
    name: '-[NSMutableURLRequest setURL]',
    ptr: ObjC.classes.NSMutableURLRequest['- setURL:'].implementation,
    onEnter: function(args: InvocationArguments){
        var url = new ObjC.Object(args[2]).toString();
        if (url != 'nil'){
            send({
                type: 'symbol:network',
                message: {
                    timestamp: Date.now(),
                    symbol: this.name,
                    params: url,
                    tid: this.threadId
                }
            });
        }
    },
};

const NSHTTPURLResponse_initWithURL_statusCode_HTTPVersion_headerFields : IFunctionPointer = {
    name: '-[NSHTTPURLResponse initWithURL:statusCode:HTTPVersion:headerFields:]',
    ptr: ObjC.classes.NSHTTPURLResponse['- initWithURL:statusCode:HTTPVersion:headerFields:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'symbol:network',
            message: {
                timestamp: Date.now(),
                symbol: this.name,
                params: [args[3], new ObjC.Object(args[4]).toString(), new ObjC.Object(args[5]).toString()],
                tid: this.threadId
            }
        });
    },
}*/





export const functions = [
    NSURLRequest_initWithURL_cachePolicy_timeoutInterval_,
    NSURLRequest_HTTPMethod,
    NSURLRequest_HTTPBody,
    NSURLRequest_allHTTPHeaderFields,
    //NSMutableURLRequest_setHTTPBody,

    NSURLSession_dataTaskWithURL_completionHandler_



    /*NSMutableURLRequest_setURL,
    NSURLRequest_requestWithURL,
    NSURLRequest_requestWithURL_cachePolicy_timeoutInterval,
    NSMutableURLRequest_setMainDocumentURL,
    NSMutableURLRequest_setHTTPMethod,

    NSHTTPURLResponse_initWithURL_statusCode_HTTPVersion_headerFields,

    //NSMutableURLRequest_setValue_forHTTPHeaderField,
    //NSMutableURLRequest_setHTTPBody,*/

]

/*const CFNetworkFramework = 'CFNetwork';


const CFHTTPMessageCopyRequestURL : IFunctionPointer = {
    name: 'CFHTTPMessageCopyRequestURL',
    ptr: Module.getExportByName(CFNetworkFramework, "CFHTTPMessageCopyRequestURL"),
    onEnter: function(args: InvocationArguments){
        send({
            type: 'symbol:network',
            message: {
                timestamp: Date.now(),
                symbol: this.name,
                params: new ObjC.Object(args[0]).toString(),
                tid: this.threadId
            }
        });
    },
}

export const functions = [
    CFHTTPMessageCopyRequestURL,
]*/

