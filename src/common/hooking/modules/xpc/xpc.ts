import ObjC from 'frida-objc-bridge';
import { IFunctionPointer } from '../interfaces.js';
import { xpc_dictionary_get_value } from './libFunctions.js'
import { ObjCObjectTOJSONString } from '../../../lib/helpers.js';
import {  parseXPCConnectionObject, parseXPCDictionaryObject } from './helper.js'

import {
    libXPCDylib,
    xpc_connection_send_message,
    xpc_connection_send_message_ptr
} from '../../../lib/libraries/libxpc.js'

const pendingBlocks = new Set();


const xpc_connection_send_message_hook: IFunctionPointer = {
    name: xpc_connection_send_message,
    ptr: xpc_connection_send_message_ptr,
    onEnter: function(args: InvocationArguments){
        let jsonConn = parseXPCConnectionObject(args[0]);
        let jsonMsg = parseXPCDictionaryObject(args[1]);

	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [jsonConn, jsonMsg],
            }
	    });
    }
};

const xpc_connection_send_message_with_reply: IFunctionPointer = {
    name: 'xpc_connection_send_message_with_reply',
    ptr: Process.getModuleByName(libXPCDylib).getSymbolByName('xpc_connection_send_message_with_reply'),
    onEnter: function(args: InvocationArguments){
        let jsonConn = parseXPCConnectionObject(args[0]);
        let jsonMsg = parseXPCDictionaryObject(args[1]);

        const callback = new ObjC.Block(args[3]);
        pendingBlocks.add(callback);
        const appCallback = callback.implementation;
        callback.implementation = (xpc_obj) => {

            send({
                type: 'xpc',
                timestamp: Date.now(),
                symbol: this.name+"-callback",
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [parseXPCDictionaryObject(xpc_obj)],
                }
            });
            appCallback(xpc_obj);
            pendingBlocks.delete(callback);
            return;
        }

	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [jsonConn, jsonMsg],
            }
	    });
    }
};

const xpc_connection_send_message_with_reply_sync: IFunctionPointer = {
    name: 'xpc_connection_send_message_with_reply_sync',
    ptr: Process.getModuleByName(libXPCDylib).getSymbolByName('xpc_connection_send_message_with_reply_sync'),
    onEnter: function(args: InvocationArguments){
        this.jsonConn = parseXPCConnectionObject(args[0]);
        this.jsonMsg = parseXPCDictionaryObject(args[1]);
    },
    onLeave: function(retval: NativePointer){
        //console.log("!", retval);
        let retObj = parseXPCDictionaryObject(retval);
        //console.log(">>", retObj);
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.jsonConn, this.jsonMsg],
		        ret: retObj
            }
	    });
    }
};


/*const xpc_connection_send_notification: IFunctionPointer = {
    name: 'xpc_connection_send_notification',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_send_notification'),
    onEnter: function(args: InvocationArguments){
        let jsonConn = parseXPCConnectionObject(args[0]);
        let jsonMsg = parseXPCDictionaryObject(args[1]);
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [jsonConn, jsonMsg],
            }
	    });
    }
};*/

const _xpc_connection_call_event_handler: IFunctionPointer = {
    name : 'xpc_connection_call_event_handler',
    ptr: DebugSymbol.fromName('_xpc_connection_call_event_handler').address,
    onEnter: function(args: InvocationArguments){
        let jsonConn = parseXPCConnectionObject(args[0]);
        let jsonMsg = parseXPCDictionaryObject(args[1]);

        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [jsonConn, jsonMsg],
            }
	    });
    }
}


export const xpc_functions = [
    _xpc_connection_call_event_handler,
    xpc_connection_send_message_hook,
    xpc_connection_send_message_with_reply,
    xpc_connection_send_message_with_reply_sync,
    
    //xpc_connection_send_notification,
    //xpc_dictionary_get_audit_token
    //xpc_create_from_plist
    //xpc_connection_create_mach_service
]