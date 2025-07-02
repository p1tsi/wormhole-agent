import ObjC from 'frida-objc-bridge';
import { IFunctionPointer } from './interfaces.js';
import { frameworkCFNetwork } from '../../lib/libraries.js';
import { ObjCObjectTOJSONString } from '../../lib/helpers.js'


const pendingBlocks = new Set();


const CFURLRequestSetHTTPRequestBody : IFunctionPointer = {
    name: 'CFURLRequestSetHTTPRequestBody',
    ptr: Process.getModuleByName(frameworkCFNetwork).getSymbolByName('CFURLRequestSetHTTPRequestBody'),
    onEnter: function(args: InvocationArguments){
        console.log("CFURLRequestSetHTTPRequestBody");
        if (args[1]){
            let data = new ObjC.Object(args[1]);
            //console.log(data);
            if (data){
                let length = data.length();
                if (length > 0){
                    let request = new ObjC.Object(args[0]);
                    //console.log("request", request);
                    let url = request.URL()?.toString();
                    let method = request.HTTPMethod()?.toString();
                    let headers = request.allHTTPHeaderFields();
                    if (headers){
                        headers = headers.toString();
                    }
                    send({
                        type: 'network',
                        timestamp: Date.now(),
                        symbol: this.name,
                        tid: this.threadId,
                        data: {
                            args: [url, method, headers]
                        }
                    }, data.bytes().readByteArray(length));
                }
            }
        }
    }
}

const CFURLRequestSetHTTPRequestBodyStream : IFunctionPointer = {
    name: 'CFURLRequestSetHTTPRequestBodyStream',
    ptr: Process.getModuleByName(frameworkCFNetwork).getSymbolByName('CFURLRequestSetHTTPRequestBodyStream'),
    onEnter: function(args: InvocationArguments){
        //console.log("CFURLRequestSetHTTPRequestBodyStream");
        //console.log(args[0], args[1]);
        if (args[1]){
            let data = new ObjC.Object(args[1]);
            //console.log(data.$className);
            if (data){
                let length = data.length();
                if (length > 0){
                    let request = new ObjC.Object(args[0]);
                    let url = request.URL().toString();
                    let method = request.HTTPMethod().toString();
                    let headers = request.allHTTPHeaderFields().toString();
                    send({
                        type: 'network',
                        timestamp: Date.now(),
                        symbol: this.name,
                        tid: this.threadId,
                        data: {
                            args: [url]
                        }
                    }, data.bytes().readByteArray(length));
                }
            }
        }
    }
}

//===================================================================================================================
//=============================================   REQUESTS   ========================================================
//===================================================================================================================

function getCookies(url){
    //TODO: make cookies JSON serializable
    let cookies = ObjC.classes.NSHTTPCookieStorage.sharedHTTPCookieStorage().cookiesForURL_(url);
    let cookieAsDict = [];
    if (cookies){
        for (let i = 0; i < cookies.count(); i++){
            let cookie = cookies.objectAtIndex_(i);
            //if (cookie){
            cookieAsDict.push(cookie.properties().toString());
            //}
        }
    }
    return cookieAsDict;
}


//NB: For additional HTTP request Headers (such as User-Agent, Accept-Encoding or Accept-Language):
/*
    this.session = args[0];
    onLeave: function(retval: NativePointer){
        console.log(new ObjC.Object(this.session).configuration().$ivars._HTTPAdditionalHeaders);
    }
*/

const NSURLSession_dataTaskWithRequest_ :IFunctionPointer = {
    name: '-[NSURLSession dataTaskWithRequest:]',
    ptr: ObjC.classes.NSURLSession['- dataTaskWithRequest:'].implementation,
    onEnter: function(args: InvocationArguments){
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }
        send({
            type: 'network',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_dataTaskWithRequest_completionHandler_ :IFunctionPointer = {
    name: '-[NSURLSession dataTaskWithRequest:completionHandler:]',
    ptr: ObjC.classes.NSURLSession['- dataTaskWithRequest:completionHandler:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }

        const callback = new ObjC.Block(args[3]);
        pendingBlocks.add(callback);
        const appCallback = callback.implementation;
        callback.implementation = (data, httpResponse, error) => {
            if (!error){
                let responseData = new ObjC.Object(data);

                send({
                    type: 'network',
                    timestamp: Date.now(),
                    symbol: this.name+"-callback",
                    tid: Process.getCurrentThreadId(),
                    data: {
                        args: [
                            new ObjC.Object(httpResponse).URL().toString(),
                        ],
                    }
                }, responseData.bytes().readByteArray(responseData.length()));
            }

            appCallback(data, httpResponse, error);
            pendingBlocks.delete(callback);
            return;
        }

        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_uploadTaskWithRequest_fromData_ :IFunctionPointer = {
    name: '-[NSURLSession uploadTaskWithRequest:fromData:]',
    ptr: ObjC.classes.NSURLSession['- uploadTaskWithRequest:fromData:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }
        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}


const NSURLSession_uploadTaskWithRequest_fromData_completionHandler_ :IFunctionPointer = {
    name: '-[NSURLSession uploadTaskWithRequest:fromData:completionHandler:]',
    ptr: ObjC.classes.NSURLSession['- uploadTaskWithRequest:fromData:completionHandler:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = new ObjC.Object(args[3]);
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }

        const callback = new ObjC.Block(args[4]);
        //console.log(this.name, callback.types);
        pendingBlocks.add(callback);
        const appCallback = callback.implementation;
        callback.implementation = (data, httpResponse, error) => {
            //console.log(data);
            //console.log(httpResponse);
            //console.log(error);

            if (!error){
                send({
                    type: 'network',
                    timestamp: Date.now(),
                    symbol: this.name+"-callback-",
                    tid: Process.getCurrentThreadId(),
                    data: {
                        args: [httpResponse.URL().toString()],
                    }
                }, data.bytes().readByteArray(data.length()));
            }

            appCallback(data, httpResponse, error);
            pendingBlocks.delete(callback);
            return;
        }

        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_uploadTaskWithRequest_fromFile_ :IFunctionPointer = {
    name: '-[NSURLSession uploadTaskWithRequest:fromFile:]',
    ptr: ObjC.classes.NSURLSession['- uploadTaskWithRequest:fromFile:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }
        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_uploadTaskWithRequest_fromFile_completionHandler_ : IFunctionPointer = {
    name: '-[NSURLSession uploadTaskWithRequest:fromFile:completionHandler:]',
    ptr: ObjC.classes.NSURLSession['- uploadTaskWithRequest:fromFile:completionHandler:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }

        const callback = new ObjC.Block(args[4]);
        console.log(this.name, callback.types);
        pendingBlocks.add(callback);
        const appCallback = callback.implementation;
        callback.implementation = (a1, a2, a3) => {
            console.log(1, new ObjC.Object(a1));
            console.log(2, new ObjC.Object(a2));
            console.log(3, new ObjC.Object(a3));

            if (!a3){
                send({
                    type: 'network',
                    timestamp: Date.now(),
                    symbol: this.name+"-callback",
                    tid: Process.getCurrentThreadId(),
                    data: {
                        args: [new ObjC.Object(a1).toString(), new ObjC.Object(a2).toString()],
                    }
                });
            }

            appCallback(a1, a2, a3);
            pendingBlocks.delete(callback);
            return;
        }

        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_downloadTaskWithRequest_ :IFunctionPointer = {
    name: '-[NSURLSession downloadTaskWithRequest:]',
    ptr: ObjC.classes.NSURLSession['- downloadTaskWithRequest:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }
        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_downloadTaskWithRequest_completionHandler_ :IFunctionPointer = {
    name: '-[NSURLSession downloadTaskWithRequest:completionHandler:]',
    ptr: ObjC.classes.NSURLSession['- downloadTaskWithRequest:completionHandler:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }

        const callback = new ObjC.Block(args[3]);
        pendingBlocks.add(callback);
        const appCallback = callback.implementation;
        callback.implementation = (filepath, httpResponse, error) => {
            let data = ObjC.classes.NSData.dataWithContentsOfURL_(filepath);
            send({
                type: 'network',
                timestamp: Date.now(),
                symbol: this.name+"-callback",
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [new ObjC.Object(httpResponse).URL().toString(), error],
                }
            }, data.bytes().readByteArray(data.length()));

            appCallback(filepath, httpResponse, error);
            pendingBlocks.delete(callback);
            return;
        }

        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}

const NSURLSession_uploadTaskWithStreamedRequest_ :IFunctionPointer = {
    name: '-[NSURLSession uploadTaskWithStreamedRequest:]',
    ptr: ObjC.classes.NSURLSession['- uploadTaskWithStreamedRequest:'].implementation,
    onEnter: function(args: InvocationArguments){
        let timestamp = Date.now();
        let request = new ObjC.Object(args[2]);
        let url = request.URL().toString();
        let method = request.HTTPMethod().toString();
        let headers = request.allHTTPHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        let cookies = getCookies(request.URL());
        let body = request.HTTPBody();
        let bodyByteArray;
        if (body && body.length() > 0){
            bodyByteArray = body.bytes().readByteArray(body.length());
        }
        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, method, headers, cookies]
            }
        }, bodyByteArray);
    }
}


//===================================================================================================================
//=============================================  RESPONSES  =========================================================
//===================================================================================================================

const NSURLResponse__initWithCFURLResponse_: IFunctionPointer = {
    name: '-[NSURLResponse _initWithCFURLResponse:]',
    ptr: ObjC.classes.NSURLResponse['- _initWithCFURLResponse:'].implementation,
    onLeave: function(retval: NativePointer){
        let timestamp = Date.now();
        let response = new ObjC.Object(retval);
        let url = response.URL().toString();
        let statusCode = response.statusCode();
        let headers = response.allHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, statusCode, headers]
            }
        });
    }
}

const NSURLResponse__responseWithCFURLResponse_: IFunctionPointer = {
    name: '+[NSURLResponse _responseWithCFURLResponse:]',
    ptr: ObjC.classes.NSURLResponse['+ _responseWithCFURLResponse:'].implementation,
    onLeave: function(retval: NativePointer){
        let timestamp = Date.now();
        let response = new ObjC.Object(retval);
        let url = response.URL().toString();
        let statusCode = response.statusCode();
        let headers = response.allHeaderFields();
        if (headers){
            headers = ObjCObjectTOJSONString(headers);
        }
        send({
            type: 'network',
            timestamp: timestamp,
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [url, statusCode, headers]
            }
        });
    }
}

const NSMutableURLRequest_setValue_forHTTPHeaderField_ : IFunctionPointer = {
    name: '-[NSMutableURLRequest setValue:forHTTPHeaderField:]',
    ptr: ObjC.classes.NSMutableURLRequest['- setValue:forHTTPHeaderField:'].implementation,
    onEnter: function(args: InvocationArguments){
        var value = new ObjC.Object(args[2]).toString();
        if (value != 'nil'){
            var header = new ObjC.Object(args[3]).toString();
            var url = new ObjC.Object(args[0]).URL().toString();
            send({
                type: 'network',
                timestamp: Date.now(),
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [url, header, value]
                }
            });
        }
    },
}






export const network_functions = [
    //CFURLRequestSetHTTPRequestBody,
    //CFURLRequestSetHTTPRequestBodyStream,

    NSURLSession_dataTaskWithRequest_,
    NSURLSession_dataTaskWithRequest_completionHandler_,
    NSURLSession_uploadTaskWithRequest_fromData_,
    NSURLSession_uploadTaskWithRequest_fromData_completionHandler_,
    NSURLSession_uploadTaskWithRequest_fromFile_,
    NSURLSession_uploadTaskWithRequest_fromFile_completionHandler_,
    NSURLSession_uploadTaskWithStreamedRequest_,
    NSURLSession_downloadTaskWithRequest_,
    NSURLSession_downloadTaskWithRequest_completionHandler_,

    // RESPONSES
    NSURLResponse__initWithCFURLResponse_,
    //NSURLResponse__responseWithCFURLResponse_,
    //NSURLResponse__initWithInternal_,
    //NSCachedURLResponse_initWithResponse_data_userInfo_storagePolicy_,


    //HEADERS
    NSMutableURLRequest_setValue_forHTTPHeaderField_
]