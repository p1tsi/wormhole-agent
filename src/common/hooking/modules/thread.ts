import { IFunctionPointer } from './interfaces.js';
import { libSystemPthreadDylib } from '../../lib/libraries.js';


const pthread_create: IFunctionPointer = {
    name: 'pthread_create',
    ptr: Process.getModuleByName(libSystemPthreadDylib).getSymbolByName("pthread_create"),
    onLeave: function(retval: NativePointer){
        send({
		    type: 'thread',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: this.threadId,
		    data: {
		        ret: retval
            }
	    });
    }
};


export const functions = [
    pthread_create,
];