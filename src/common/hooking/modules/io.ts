import { IFunctionPointer } from './interfaces.js';
import {
    close_ptr,
    open_ptr,
    read_ptr,
    write_ptr
} from '../../lib/libraries/libsystem_kernel.js';

import { libSystemC } from '../../lib/libraries/libsystem_c.js';


/*
    LIBSYSTEM_KERNEL FUNCTIONS
*/
const open: IFunctionPointer = {
    name: 'open',
    ptr: open_ptr,
    /*onEnter: function(args: InvocationArguments){
        this.timestamp = Date.now();
        this.filepath = args[0].readUtf8String();
        this.mode = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'io',
		    symbol: this.name,
		    timestamp: this.timestamp,
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.filepath, this.mode],
		        ret: retval.toString(),
            }
	    });
    },*/
    cm: new CModule(`
        #include <stdio.h>
        #include <gum/guminterceptor.h>

        extern void send_func(void *, void *);

        typedef struct _IcState IcState;
        struct _IcState
        {
          gpointer path;
          int mode;
        };

        void
        on_enter(GumInvocationContext *ic)
        {
            IcState *is = GUM_IC_GET_INVOCATION_DATA(ic, IcState);
            is->path = gum_invocation_context_get_nth_argument(ic, 0);
            is->mode = GPOINTER_TO_INT(gum_invocation_context_get_nth_argument(ic, 1));
        }

        void
        on_leave(GumInvocationContext *ic)
        {
            IcState *is = GUM_IC_GET_INVOCATION_DATA(ic, IcState);
            gpointer retval = gum_invocation_context_get_return_value(ic);
            send_func(is, retval);
        }
    `, {
          send_func: new NativeCallback((args, retval) => {
                send(
                    {
                        type: 'io',
                        symbol: 'open',
                        timestamp: Date.now(),
                        tid: Process.getCurrentThreadId(),
                        data: {
                            args: [args.readPointer().readUtf8String(), "0x" + args.add(0x8).readInt()],
                            ret: retval,
                        }
                    }
                )
          }, 'void', ['pointer', 'pointer'])
    })
};

const read: IFunctionPointer = {
    name: 'read',
    ptr: read_ptr,
    onEnter: function(args: InvocationArguments){
        this.timestamp = Date.now();
        this.fd = args[0];
        this.buf = args[1];
    },
    onLeave: function(retval: NativePointer){
        var len = int64(retval.toString()).toNumber();
        var buffer = this.buf.readByteArray(len);
        send({
                type: 'io',
                symbol: this.name,
                timestamp: this.timestamp,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [this.fd]
                }
            },
	        buffer
	    );
    },
};

/*const pread: IFunctionPointer = {
    name: 'pread',
    ptr: Module.getExportByName(libSystemKernelDylib, "pread"),
    onEnter: function(args: InvocationArguments){
        this.buf = args[1];
    },
    onLeave: function(retval: NativePointer){
        var len = int64(retval.toString()).toNumber();
        var readData = this.buf.readByteArray(len);
        send({
                type: 'io',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId()
            },
		    readData
        );
    },
};*/

const write: IFunctionPointer = {
    name: 'write',
    ptr: write_ptr,
    onEnter: function(args: InvocationArguments){
        var length = int64(args[2].toString()).toNumber();
        var writtenData = args[1].readByteArray(length); //.unwrap().readCString();
        send({
                type: 'io',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data:{
                    args: [args[0].toString()]
                }
            },
            writtenData
	    );
    },
};

const close: IFunctionPointer = {
    name: 'close',
    ptr: close_ptr,
    onEnter: function(args: InvocationArguments){
        this.timestamp = Date.now();
        this.fd = args[0].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
                type: 'io',
                timestamp: this.timestamp,
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [this.fd],
                    ret: retval
                }
	    });
    },
};

//=====================================================================================================================
//=====================================================================================================================

const fileno = new NativeFunction(Process.getModuleByName(libSystemC).getSymbolByName("fileno"), "int", ["pointer"]);


/*
    LIBSYSTEM_C FUNCTIONS
*/
const fopen: IFunctionPointer = {
    name: 'fopen',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName("fopen"),
    onEnter: function(args: InvocationArguments){
        this.filepath = args[0].readUtf8String();
        this.mode = args[1].readUtf8String();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'io',
		    timestamp: Date.now(),
		    symbol: this.name,
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.filepath, this.mode],
		        ret: '0x'+fileno(retval).toString(16)
            }
	    });
    },
};

const fclose: IFunctionPointer = {
    name: 'fclose',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName("fclose"),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'io',
            timestamp: Date.now(),
            tid: Process.getCurrentThreadId(),
            symbol: this.name,
		    data: {
		        args: ['0x'+fileno(args[0]).toString(16)],
            }
	    });
    },
};

const fread: IFunctionPointer = {
    name: 'fread',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName('fread'),
    onEnter: function(args: InvocationArguments){
        this.buf = args[0];
        this.fd = '0x'+fileno(args[3]).toString(16);
        this.size = int64(args[1].toString()).toNumber();
    },
    onLeave: function(retval: NativePointer){
        var length = int64(retval.toString()).toNumber();
        var readData = this.buf.readByteArray(length * this.size);
        send({
                type: 'io',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [this.fd]
                }
            },
            readData
	    );
    }
};

const fwrite: IFunctionPointer = {
    name: 'fwrite',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName('fwrite'),
    onEnter: function(args: InvocationArguments){
        this.buf = args[0];
        this.fd = '0x'+fileno(args[3]).toString(16);
        this.size = int64(args[1].toString()).toNumber();
    },
    onLeave: function(retval: NativePointer){
        var length = int64(retval.toString()).toNumber();
        var writtenData = this.buf.readByteArray(length * this.size);
        send({
                type: 'io',
                symbol: this.name,
                timestamp: Date.now(),
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [this.fd]
                }
            },
            writtenData
	    );
    },
};


//=====================================================================================================================

export const io_functions = [
    // libsystem_kernel
    open,
    read,
    write,
    close,
    //pread,

    // libsystem_c
    //popen, // seems to be unused PIPE
    //pclose

    fopen,
    fclose,
    //fread,
    fwrite,
];