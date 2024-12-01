import { IFunctionPointer } from '../lib/interfaces';
import { libIOKit } from '../../lib/libraries';


const IOServiceMatching: IFunctionPointer = {
    name: 'IOServiceMatching',
    ptr: Module.getExportByName(libIOKit, "IOServiceMatching"),
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
    ptr: Module.getExportByName(libIOKit, "IOServiceNameMatching"),
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
    ptr: Module.getExportByName(libIOKit, "IOServiceGetMatchingService"),
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
    ptr: Module.getExportByName(libIOKit, "IOServiceGetMatchingServices"),
    onEnter: function(args: InvocationArguments){
        this.existing = args[2];
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'IOKit',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.existing],
            }
	    });
    }
};


const IOServiceOpen: IFunctionPointer = {
    name: 'IOServiceOpen',
    ptr: Module.getExportByName(libIOKit, "IOServiceOpen"),
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
    ptr: Module.getExportByName(libIOKit, "IOIteratorNext"),
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
    ptr: Module.getExportByName(libIOKit, "IOConnectCallMethod"),
    onEnter: function(args: InvocationArguments){
        this.port = args[0];
        this.sel = args[1].toInt32();
        // Scalar inputs...
        this.scalarInputCnt = args[3].toInt32();
        if (this.scalarInputCnt > 0){
            this.scalarInput = args[2].readInt();
        }
        else{
            this.scalarInput = 0;
        }

        //Struct inputs...
        this.structInputCnt = args[5].toInt32();
        if (this.structInputCnt > 0){
            this.structInput = args[4];
        }
        else{
            this.structInput = 0;
        }


        this.outputCnt = args[7];
        if (!this.outputCnt.isNull()){
            this.outputCnt = args[7].readInt();

            this.output = args[6];
            if (!this.output.isNull()){
                this.output = args[6].readInt();
            }
            else{
                this.output = 0;
            }
        }
        else{
            this.outputCnt = 0;
            this.output = 0;
        }

        this.outputStructCnt = args[9];
        if (!this.outputStructCnt.isNull()){
            this.outputStructCnt = args[9].readInt();
            this.outputStruct = args[8];
        }
        else{
            this.outputStruct = 0;
            this.outputStructCnt = 0;
        }

        this.data = null;
        if (this.structInput){
            this.data = this.structInput.readByteArray(this.structInputCnt);
            console.log(this.data);
        }


    },
    onLeave: function(retval: NativePointer){
        if (this.outputStruct){
            if (this.data){
                this.data = this.outputStruct.readByteArray(this.outputStructCnt);
            }
            else{
                this.data = this.outputStruct.readByteArray(this.outputStructCnt);
            }
        }
        if (this.data){
            send({
                type: 'IOKit',
                symbol: this.name,
                timestamp: Date.now(),
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [
                        this.port,
                        this.sel,
                        this.scalarInput,
                        this.scalarInputCnt,
                        this.structInput,
                        this.structInputCnt,
                        this.output,
                        this.outputCnt,
                        this.outputStruct,
                        this.outputStructCnt
                    ],
                    ret: retval
                }
            }, this.data);
        }
        else{
            send({
                type: 'IOKit',
                symbol: this.name,
                timestamp: Date.now(),
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [
                        this.port,
                        this.sel,
                        this.scalarInput,
                        this.scalarInputCnt,
                        this.structInput,
                        this.structInputCnt,
                        this.output,
                        this.outputCnt,
                        this.outputStruct,
                        this.outputStructCnt
                    ],
                    ret: retval
                }
            });
        }

    }
};


const IOConnectCallScalarMethod: IFunctionPointer = {
    name: 'IOConnectCallScalarMethod',
    ptr: Module.getExportByName(libIOKit, "IOConnectCallScalarMethod"),
    onEnter: function(args: InvocationArguments){
        this.port = args[0];
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
};


export const IOKit_functions = [
    IOServiceMatching,
    IOServiceNameMatching,
    IOServiceGetMatchingService,

    //IOServiceGetMatchingServices,

    IOServiceOpen,
    //IOIteratorNext,
    IOConnectCallMethod,


    /*IOConnectCallScalarMethod,
    IOConnectCallStructMethod,
    IOConnectCallAsyncMethod,
    IOConnectCallAsyncScalarMethod,
    IOConnectCallAsyncStructMethod,

    IOServiceAddInterestNotification,
    IOConnectSetNotificationPort*/
];