/*const xpc_connection_create_from_endpoint: IFunctionPointer = {
    name: 'xpc_connection_create_from_endpoint',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_create_from_endpoint'),
    onEnter: function(args: InvocationArguments){
        this.endpoint = args[0].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.endpoint],
		        ret: retval.toString()
            }
	    });
    }
};


const xpc_connection_create_mach_service: IFunctionPointer = {
    name: 'xpc_connection_create_mach_service',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_create_mach_service'),
    onEnter: function(args: InvocationArguments){
        this.service = args[0].readUtf8String();
        this.flags = args[2].toInt32();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.service, this.flags],
		        ret: retval.toString()
            }
	    });
    }
};


const xpc_connection_create: IFunctionPointer = {
    name: 'xpc_connection_create',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_connection_create'),
    onEnter: function(args: InvocationArguments){
        this.name = args[0].readUtf8String();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.name],
		        ret: retval.toString()
            }
	    });
    }
};


const xpc_dictionary_create: IFunctionPointer = {
    name: 'xpc_dictionary_create',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_create'),
    onEnter: function(args: InvocationArguments){
        if (args[0]){
            this.keys = args[0].toString();
        }
        else{
            this.keys = 'NULL';
        }
        if (args[1]){
            this.values = args[1].toString();
        }
        else{
            this.values = 'NULL';
        }
        this.count = args[2].toInt32()
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.keys, this.values, this.count],
		        ret: retval.toString()
            }
	    });
    }
};


const xpc_dictionary_create_empty: IFunctionPointer = {
    name: 'xpc_dictionary_create_empty',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_create_empty'),
    onLeave: function(retval: NativePointer){
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        ret: retval.toString()
            }
	    });
    }
};


const xpc_dictionary_create_reply: IFunctionPointer = {
    name: 'xpc_dictionary_create_reply',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_create_reply'),
    onLeave: function(retval: NativePointer){
        send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        ret: retval.toString()
            }
	    });
    }
};


const xpc_dictionary_set_string: IFunctionPointer = {
    name: 'xpc_dictionary_set_string',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_string'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), args[2].readUtf8String()],
            }
	    });
    }
};

const xpc_dictionary_set_int64: IFunctionPointer = {
    name: 'xpc_dictionary_set_int64',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_int64'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), int64(args[2].toString())],
            }
	    });
    }
};


const xpc_dictionary_set_date: IFunctionPointer = {
    name: 'xpc_dictionary_set_date',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_date'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), int64(args[2].toString())],
            }
	    });
    }
};

const xpc_dictionary_set_bool: IFunctionPointer = {
    name: 'xpc_dictionary_set_bool',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_bool'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), args[2].toString()],
            }
	    });
    }
};

const xpc_dictionary_set_uint64: IFunctionPointer = {
    name: 'xpc_dictionary_set_uint64',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_uint64'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), uint64(args[2].toString())],
            }
	    });
    }
};

const xpc_dictionary_set_double: IFunctionPointer = {
    name: 'xpc_dictionary_set_double',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_double'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), args[2].toString()],  // TODO: SISTEMARE IL DOBULE
            }
	    });
    }
};


const xpc_dictionary_set_uuid: IFunctionPointer = {
    name: 'xpc_dictionary_set_uuid',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_uuid'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), args[2].toString()],
            }
	    });
    }
};


const xpc_dictionary_set_data: IFunctionPointer = {
    name: 'xpc_dictionary_set_data',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_data'),
    onEnter: function(args: InvocationArguments){
        this.bytes = args[2].readByteArray(args[3].toInt32());
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String()],
            }
	    }, this.bytes);
    }
};


const xpc_dictionary_set_fd: IFunctionPointer = {
    name: 'xpc_dictionary_set_fd',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_fd'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), args[2].toInt32()],
            }
	    });
    }
};


const xpc_dictionary_set_value: IFunctionPointer = {
    name: 'xpc_dictionary_set_value',
    ptr: Module.getExportByName(libXPCDylib, 'xpc_dictionary_set_value'),
    onEnter: function(args: InvocationArguments){
	    send({
		    type: 'xpc',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].toString(), args[1].readUtf8String(), args[2].toString()],
            }
	    });
    }
};*/