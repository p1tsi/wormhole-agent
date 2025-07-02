import { IFunctionPointer } from './interfaces.js';
import {
    libDyldDylib,
} from '../../lib/libraries.js';



const dlopen: IFunctionPointer = {
    name: 'dlopen',
    ptr: Process.getModuleByName(libDyldDylib).getSymbolByName('dlopen'),
    onEnter: function(args: InvocationArguments){
        this.dylib = args[0].readUtf8String();
        //this.mode = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'dyld',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.dylib],
		        ret: retval.toString(),
            }
	    });
    },
};

const dlopen_from: IFunctionPointer = {
    name: 'dlopen_from',
    ptr: Process.getModuleByName(libDyldDylib).getSymbolByName('dlopen_from'),
    onEnter: function(args: InvocationArguments){
        this.dylib = args[0].readUtf8String();
        this.mode = args[1].toString();
        this.bo = args[2].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'dyld',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.dylib, this.mode, this.bo],
		        ret: retval.toString(),
            }
	    });
    },
};

const dlsym: IFunctionPointer = {
    name: 'dlsym',
    ptr: Process.getModuleByName(libDyldDylib).getSymbolByName('dlsym'),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'dyld',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String()],
            }
	    });
    },
};


const dlclose: IFunctionPointer = {
    name: 'dlclose',
    ptr: Process.getModuleByName(libDyldDylib).getSymbolByName('dlclose'),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'dyld',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [args[0].toString()],
            }
	    });
    }
};


export const dyld_functions = [
    dlopen,
    dlclose,
    dlsym,
    dlopen_from
]