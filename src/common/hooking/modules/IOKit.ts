import ObjC from 'frida-objc-bridge';

import { IFunctionPointer } from './interfaces.js';
import { frameworkIOKit } from '../../lib/libraries.js';


const IOServiceMatching: IFunctionPointer = {
    name: 'IOServiceMatching',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOServiceMatching"),
    onEnter: function(args: InvocationArguments){
        this.service = args[0].readUtf8String();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.service],
		        ret: new ObjC.Object(retval).toString()
            }
	    });
    },
};

const IOServiceNameMatching: IFunctionPointer = {
    name: 'IOServiceNameMatching',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOServiceNameMatching"),
    onEnter: function(args: InvocationArguments){
        this.service = args[0].readUtf8String();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.service],
		        ret: new ObjC.Object(retval).toString()
            }
	    });
    },
};

const IOServiceGetMatchingService: IFunctionPointer = {
    name: 'IOServiceGetMatchingService',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOServiceGetMatchingService"),
    onEnter: function(args: InvocationArguments){
        this.matching = new ObjC.Object(args[1]).toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.matching],
		        ret: retval
            }
	    });
    }
};


const IOServiceGetMatchingServices: IFunctionPointer = {
    name: 'IOServiceGetMatchingServices',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOServiceGetMatchingServices"),
    onEnter: function(args: InvocationArguments){
        this.d = new ObjC.Object(args[1]).toString();
    },
    onLeave: function(retval: NativePointer){
        send({
            type: 'IOKit',
            symbol: this.name,
            timestamp: Date.now(),
            tid: Process.getCurrentThreadId(),
            data: {
                args: [this.d],
                ret: retval
            }
        });
    }
};


const IOServiceOpen: IFunctionPointer = {
    name: 'IOServiceOpen',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOServiceOpen"),
    onEnter: function(args: InvocationArguments){
        this.service = args[0],
        this.conn = args[3];
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [
		            this.service,
                    this.conn.readPointer(4)
		        ],
		        ret: retval
            }
	    });
    }
};


const IOIteratorNext: IFunctionPointer = {
    name: 'IOIteratorNext',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOIteratorNext"),
    onEnter: function(args: InvocationArguments){
        this.iterator = args[0];
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.iterator],
		        ret: retval
            }
	    });
    }
};

const IOConnectCallMethod: IFunctionPointer = {
    name: 'IOConnectCallMethod',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOConnectCallMethod"),
    onEnter: function(args: InvocationArguments){
        this.port = args[0];
        this.sel = args[1].toInt32();

        // Scalar inputs...
        this.inputScalar = "0";
        this.inputScalarCnt = args[3].toInt32();
        if (this.inputScalarCnt > 0){
            this.inputScalar = "["
            for (let i = 0; i < this.inputScalarCnt; i++) {
                this.inputScalar += args[2].add(0x8 * i).readInt().toString();
                if (i !== this.inputScalarCnt - 1) {
                    this.inputScalar += ",";
                }
            }
            this.inputScalar += "]"
        }

        // Struct inputs...
        this.inputStructSize = args[5].toInt32();
        this.inputStruct = args[4];

        // outputScalar
        this.outputScalarCnt = args[7];
        this.outputScalar = args[6];

        // outputStruct
        this.outputStructSize = args[9];
        this.outputStruct = args[8];
    },
    onLeave: function(retval: NativePointer){
        // outputScalar
        var finalOutScalar = "0";
        var finalOutScalarCnt = 0;
        if (!this.outputScalarCnt.isNull()){
            finalOutScalarCnt = this.outputScalarCnt.readInt();
            if (finalOutScalarCnt > 0){
                finalOutScalar = "["
                for (let i = 0; i < finalOutScalarCnt; i++) {
                    finalOutScalar += this.outputScalar.add(0x8 * i).readInt().toString();
                    if (i !== finalOutScalarCnt - 1) {
                        finalOutScalar += ",";
                    }
                }
                finalOutScalar += "]"
            }
        }

        // Output Struct...
        var outputStructSize = 0;
        var outputStruct;
        if (!this.outputStructSize.isNull()){
            outputStructSize = this.outputStructSize.readInt();
            if (outputStructSize > 0 && !this.outputStruct.isNull()){
                if (outputStructSize > 10000){
                    outputStructSize = 10000;
                }
                outputStruct = this.outputStruct.readByteArray(outputStructSize);
            }
        }

        if (outputStructSize + this.inputStructSize == 0){
            send({
                type: 'IOKit',
                symbol: this.name,
                timestamp: Date.now(),
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [
                        this.port,
                        this.sel,
                        this.inputScalar,
                        this.inputScalarCnt,
                        0,
                        0,
                        finalOutScalar,
                        finalOutScalarCnt,
                        0,
                        0
                    ],
                    ret: retval
                }
            });
        }
        else{
            var finalSize = outputStructSize + this.inputStructSize;
            var p = Memory.alloc(finalSize);

            if (this.inputStructSize > 0 && !this.inputStruct.isNull()){
                p.writeByteArray(this.inputStruct.readByteArray(this.inputStructSize));
            }

            if (outputStructSize > 0){
                if (this.inputStructSize > 0){
                    p.add(this.inputStructSize).writeByteArray(this.outputStruct.readByteArray(outputStructSize));
                }
                else{
                    p.writeByteArray(this.outputStruct.readByteArray(outputStructSize));
                }
            }

            send({
                type: 'IOKit',
                symbol: this.name,
                timestamp: Date.now(),
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [
                        this.port,
                        this.sel,
                        this.inputScalar,
                        this.inputScalarCnt,
                        0,
                        this.inputStructSize,
                        finalOutScalar,
                        finalOutScalarCnt,
                        0,
                        outputStructSize
                    ],
                    ret: retval
                }
            }, p.readByteArray(finalSize));
        }
    }
};

const IOConnectCallScalarMethod: IFunctionPointer = {
    name: 'IOConnectCallScalarMethod',
    ptr: Process.getModuleByName(frameworkIOKit).getSymbolByName("IOConnectCallScalarMethod"),
    onEnter: function(args: InvocationArguments){
        this.port = args[0];
        this.sel = args[1].toInt32();
        //this.output = args[4];
        this.outputCnt = args[5];

        this.input = 0;
        this.output = 0;
        if (args[3].toInt32() > 0){
            //console.log("INPUT COUNT: ", args[3].toInt32());
            //this.input = args[2].readPointer();
        }
    },
    onLeave: function(retval: NativePointer){
        if (!this.outputCnt.isNull()){
            if (this.outputCnt.readInt() > 0){
               //console.log("OUTPUT COUNT:", this.outputCnt.readInt());
               //console.log("OUTPUT:", this.output);
            }
        }
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [
		            this.port,
		            this.sel,
		            this.input,
		            this.output
                ],
		        ret: retval
            }
	    });
    }
};

/*
IT SEEMS LIKE THIS METHOD INTERNALLY CALLS IOConnectCallMethod
const IOConnectCallStructMethod: IFunctionPointer = {
    name: 'IOConnectCallStructMethod',
    ptr: Module.getExportByName(libIOKit, "IOConnectCallStructMethod"),
    onEnter: function(args: InvocationArguments){
        this.output = args[4];
        //this.outputCnt = args[5];
        if (args[3].toInt32() > 0){
            this.input = args[2];
        }
        else{
            this.input = 0;
        }
        this.sel = args[1].toInt32();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.sel, this.input, this.output],
		        ret: retval
            }
	    });
    }
};

const IOConnectCallAsyncMethod: IFunctionPointer = {
    name: 'IOConnectCallAsyncMethod',
    ptr: Module.getExportByName(libIOKit, "IOConnectCallAsyncMethod"),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [],
            }
	    });
    },
};

const IOConnectCallAsyncScalarMethod: IFunctionPointer = {
    name: 'IOConnectCallAsyncScalarMethod',
    ptr: Module.getExportByName(libIOKit, "IOConnectCallAsyncScalarMethod"),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [],
            }
	    });
    },
};

const IOConnectCallAsyncStructMethod: IFunctionPointer = {
    name: 'IOConnectCallAsyncStructMethod',
    ptr: Module.getExportByName(libIOKit, "IOConnectCallAsyncStructMethod"),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [],
            }
	    });
    },
};

const IOServiceAddInterestNotification: IFunctionPointer = {
    name: 'IOServiceAddInterestNotification',
    ptr: Module.getExportByName(libIOKit, "IOServiceAddInterestNotification"),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [args[1]],
            }
	    });
    },
};

const IOConnectSetNotificationPort: IFunctionPointer = {
    name: 'IOConnectSetNotificationPort',
    ptr: Module.getExportByName(libIOKit, "IOConnectSetNotificationPort"),
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [args[0]],
            }
	    });
    },
};*/


export const IOKit_functions = [
    IOServiceMatching,
    IOServiceNameMatching,
    IOServiceGetMatchingService,
    IOServiceGetMatchingServices,

    IOServiceOpen,
    //IOIteratorNext,
    IOConnectCallMethod,
    IOConnectCallScalarMethod

    /*IOConnectCallStructMethod,
    IOConnectCallAsyncMethod,
    IOConnectCallAsyncScalarMethod,
    IOConnectCallAsyncStructMethod,

    IOServiceAddInterestNotification,
    IOConnectSetNotificationPort*/
];