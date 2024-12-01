import { IFunctionPointer } from '../lib/interfaces';
import {
    libSystemCDylib,
    libSystemKernelDylib
} from '../../lib/libraries';


/*
    LIBSYSTEM_KERNEL FUNCTIONS
*/
const open: IFunctionPointer = {
    name: 'open',
    ptr: Module.getExportByName(libSystemKernelDylib, "open"),
    onEnter: function(args: InvocationArguments){
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
    },
};

const read: IFunctionPointer = {
    name: 'read',
    ptr: Module.getExportByName(libSystemKernelDylib, "read"),
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
    ptr: Module.getExportByName(libSystemKernelDylib, 'write'),
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
    ptr: Module.getExportByName(libSystemKernelDylib, 'close'),
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

const fileno = new NativeFunction(Module.getExportByName(null, "fileno"), "int", ["pointer"]);


/*
    LIBSYSTEM_C FUNCTIONS
*/
const fopen: IFunctionPointer = {
    name: 'fopen',
    ptr: Module.getExportByName(libSystemCDylib, "fopen"),
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
    ptr: Module.getExportByName(libSystemCDylib, "fclose"),
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
    ptr: Module.getExportByName(libSystemCDylib, 'fread'),
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
    ptr: Module.getExportByName(libSystemCDylib, 'fwrite'),
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