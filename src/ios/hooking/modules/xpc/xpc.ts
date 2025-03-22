import { libXPCDylib } from '../../../lib/libraries'
import { IFunctionPointer } from '../../lib/interfaces';
import { xpc_dictionary_get_value } from './libFunctions'
import { ObjCObjectTOJSONString } from '../../../lib/helpers';
import {  parseXPCConnectionObject, parseXPCDictionaryObject } from './helper'

const pendingBlocks = new Set();

const xpc_connection_get_name = new NativeFunction(Module.getExportByName(null, 'xpc_connection_get_name'), 'pointer', ['pointer']);
const xpc_dictionary_apply = new NativeFunction(Module.getExportByName(null, 'xpc_dictionary_apply'), 'pointer', ['pointer', 'pointer']);
const xpc_get_type = new NativeFunction(Module.getExportByName(null, 'xpc_get_type'), 'pointer', ['pointer']);
const xpc_int64_create = new NativeFunction(Module.getExportByName(null, 'xpc_int64_create'), 'pointer', ['int64']);

const xpc_dictionary_set_value = new NativeFunction(Module.getExportByName(null, 'xpc_dictionary_set_value'), 'void', ['pointer', 'pointer', 'pointer']);


/*const zeroPad = (num, places) => String(num).padStart(places, '0');
function printAssembly(address, count){
    var offset = 0;
    for(var i = 0; i<count; i++)
    {
        var instruction = Instruction.parse(address.add(offset))
        console.log(`${instruction.address} [+${zeroPad(offset, 3)}]  ${instruction}`)
        offset += instruction.size
    }
}*/

const xpc_connection_send_message: IFunctionPointer = {
    name: 'xpc_connection_send_message',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_send_message'),
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
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_send_message_with_reply'),
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
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_send_message_with_reply_sync'),
    onEnter: function(args: InvocationArguments){
        this.jsonConn = parseXPCConnectionObject(args[0]);
        this.jsonMsg = parseXPCDictionaryObject(args[1]);
    },
    onLeave: function(retval: NativePointer){
        console.log("!", retval);
        let retObj = parseXPCDictionaryObject(retval);
        console.log(">>", retObj);
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


const xpc_connection_send_notification: IFunctionPointer = {
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
};

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

/*const xpc_dictionary_get_audit_token: IFunctionPointer = {
    name : '_xpc_dictionary_get_audit_token',
    ptr: DebugSymbol.fromName('xpc_connection_get_audit_token').address,
    onEnter: function(args: InvocationArguments){
        let conn = parseXPCConnectionObject(args[0]);
        let jsonConn = ObjCObjectTOJSONString(conn)
        console.log(jsonConn)
        this.token = args[1];
    },
    /*onLeave: function(retval: NativePointer){
        console.log(hexdump(this.token))
    }
}*/


export const xpc_functions = [
    _xpc_connection_call_event_handler,
    xpc_connection_send_message,
    xpc_connection_send_message_with_reply,
    xpc_connection_send_message_with_reply_sync,
    xpc_connection_send_notification,


    //xpc_dictionary_get_audit_token
    //xpc_create_from_plist
    //xpc_connection_create_mach_service
]