import ObjC from 'frida-objc-bridge';
import { IFunctionPointer } from './interfaces.js';
import { libMobileGestaltDylib } from '../../lib/libraries.js';


const MGCopyAnswer_:  IFunctionPointer = {
    name: 'MGCopyAnswer',
    ptr: Process.getModuleByName(libMobileGestaltDylib).getSymbolByName("MGCopyAnswer"),
    onEnter: function(args: InvocationArguments){
        this.param = new ObjC.Object(args[0]).toString();
    },
    onLeave: function(retval: NativePointer){
        send({
            type: 'gestalt',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [this.param],
                ret: new ObjC.Object(retval).toString()
            }
        });
    }
}

export const gestalt_functions = [
    MGCopyAnswer_
]

