/*import { IFunctionPointer } from '../lib/interfaces';
import { libSystemKernelDylib } from '../../lib/libraries';



const mach_msg: IFunctionPointer = {
    name: 'mach_msg',
    ptr: Module.getExportByName(libSystemKernelDylib, 'mach_msg'),
    onEnter: function(args: InvocationArguments){
        var size;
        if (args[2].toInt32() == 0){
            size = args[3].toInt32();
        }
        else {
            size = args[2].toInt32()
        }
        this.msg = args[0].readByteArray(size);
        this.option = args[1].toInt32();
        this.send_size = args[2].toInt32();
        this.rcv_size = args[3].toInt32();
        this.rcv_name = args[4].toInt32();
        this.timeout = args[5].toInt32();
        this.notify = args[6].toInt32();
        console.log("RECV PORT: " + args[4].toInt32());
    },
    onLeave: function(retval: NativePointer){
	    send({
		    type: 'mach',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.option, this.send_size, this.rcv_size, this.rcv_name, this.timeout, this.notify],
		        ret: retval.toInt32()
            }
	    }, this.msg);
    }
};


export const functions = [
    mach_msg
]
*/



