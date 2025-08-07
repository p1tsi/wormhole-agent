import { IFunctionPointer } from './interfaces.js';
import { libSystemPthreadDylib } from '../../lib/libraries.js';
import { libSystemC } from '../../lib/libraries/libsystem_c.js';

const pthread_create: IFunctionPointer = {
    name: 'pthread_create',
    ptr: Process.getModuleByName(libSystemPthreadDylib).getSymbolByName("pthread_create"),
    onLeave: function(retval: NativePointer){
        send({
		    type: 'spawn',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: this.threadId,
		    data: {
		        ret: retval
            }
	    });
    }
};

const popen: IFunctionPointer = {
    name: 'popen',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName("popen"),
    onEnter: function(args: InvocationArguments){
        this.cmd = args[0].readUtf8String()
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'spawn',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: this.threadId,
		    data: {
                args: [this.cmd],
                ret: retval
            }
	    });
    }
};


export const spawn_functions = [
    //pthread_create,
    popen
];