import { IFunctionPointer } from '../lib/interfaces';
import { libMobileGestaltDylib } from '../../lib/libraries';


const MGCopyAnswer_:  IFunctionPointer = {
    name: 'MGCopyAnswer',
    ptr: Module.getExportByName(libMobileGestaltDylib, "MGCopyAnswer"),
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

