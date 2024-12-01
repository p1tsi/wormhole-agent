import { IFunctionPointer } from '../lib/interfaces';
import { libSystemPthreadDylib } from '../../lib/libraries';


const pthread_create: IFunctionPointer = {
    name: 'pthread_create',
    ptr: Module.getExportByName(libSystemPthreadDylib, "pthread_create"),
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