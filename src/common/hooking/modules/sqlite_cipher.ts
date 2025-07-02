/*import { IFunctionPointer } from '../lib/interfaces';
import { libSQLiteCipherDylib } from '../../lib/libraries';


//DB STUFF
const p_sqlite3_open = Module.getExportByName(libSQLiteCipherDylib, "sqlite3_open");
const p_sqlite3_open16 = Module.getExportByName(libSQLiteCipherDylib, "sqlite3_open16");
const p_sqlite3_open_v2 = Module.getExportByName(libSQLiteCipherDylib, "sqlite3_open_v2");

// QUERIES ROUTINE
const p_sqlite3_prepare = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_prepare');
const p_sqlite3_prepare_v2 = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_prepare_v2');
const p_sqlite3_prepare_v3 = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_prepare_v3');
const p_sqlite3_str_appendf = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_str_appendf');
const p_sqlite3_str_vappendf = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_str_vappendf');
const p_sqlite3_step = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_step');
const p_sqlite3_exec = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_exec');
const p_sqlite3_reset = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_reset');
const p_sqlite3_finalize = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_finalize');

// PARAMS BIND
const p_sqlite3_bind_text = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_text');
const p_sqlite3_bind_int = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_int');
const p_sqlite3_bind_int64 = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_int64');
const p_sqlite3_bind_double = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_double');
const p_sqlite3_bind_blob = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_blob');
const p_sqlite3_bind_blob64 = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_blob64');
const p_sqlite3_bind_null = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_bind_null');


// GET RESULTS
const p_sqlite3_column_int = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_int');
const p_sqlite3_column_int64 = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_int64');
const p_sqlite3_column_double = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_double');
const p_sqlite3_column_text = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_text');
const p_sqlite3_column_bytes = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_bytes');
const p_sqlite3_column_count = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_count');
const p_sqlite3_column_blob = Module.getExportByName(libSQLiteCipherDylib, 'sqlite3_column_blob');



const SQLiteOpen: IFunctionPointer = {
    name: 'sqlite3_open',
    ptr: p_sqlite3_open,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].readUtf8String()]
            }
	    });
    },
};

const SQLiteOpenV2: IFunctionPointer = {
    name: 'sqlite3_open_v2',
    ptr: p_sqlite3_open_v2,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[0].readUtf8String()]
            }
	    });
    },
};

const SQLiteOpen16: IFunctionPointer = {
    name: 'sqlite3_open16',
    ptr: p_sqlite3_open16,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    tid: this.threadId,
		    timestamp: Date.now(),
            symbol: this.name,
		    data: {
		        args: [args[0].readUtf16String()]
            }
	    });
    },
};


const SQLiteExec: IFunctionPointer = {
    name: 'sqlite3_exec',
    ptr: p_sqlite3_exec,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    tid: this.threadId,
		    timestamp: Date.now(),
            symbol: this.name,
		    data: {
		        args: [args[1].readUtf8String()]
            }
	    });
    },
};

const SQLiteReset: IFunctionPointer = {
    name: 'sqlite3_reset',
    ptr: p_sqlite3_reset,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        ret: retval.toString(),
            }
	    });
    },
};


const SQLitePrepare: IFunctionPointer = {
    name: 'sqlite3_prepare',
    ptr: p_sqlite3_prepare,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
		    symbol: this.name,
		    tid: this.threadId,
		    data: {
		        args: [args[1].readUtf8String()],
            }
	    });
    }
};

const SQLitePrepareV2: IFunctionPointer = {
    name: 'sqlite3_prepare_v2',
    ptr: p_sqlite3_prepare_v2,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
		    symbol: this.name,
		    tid: this.threadId,
		    data: {
		        args: [args[1].readUtf8String()]
            }
	    });
    }
};

const SQLitePrepareV3: IFunctionPointer = {
    name: 'sqlite3_prepare_v3',
    ptr: p_sqlite3_prepare_v3,
    onEnter: function(args: InvocationArguments){
        var a = args[1].readUtf8String().replaceAll("\n", " ").replaceAll("    ", "");
        send({
		    type: 'sqlite',
		    symbol: this.name,
		    tid: this.threadId,
		    data: {
		        args: [a]
            }
	    });
    }
};

const SQLiteStrAppendf: IFunctionPointer = {
    name: 'sqlite3_str_appendf',
    ptr: p_sqlite3_str_appendf,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    tid: this.threadId,
		    symbol: this.name,
		    data: {
		        args: [args[1].readUtf8String()]
            }
	    });
    }
};

const SQLiteStrVappendf: IFunctionPointer = {
    name: 'sqlite3_str_vappendf',
    ptr: p_sqlite3_str_vappendf,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[1].readUtf8String()]
            }
	    });
    }
};

const SQLiteFinalize: IFunctionPointer = {
    name: 'sqlite3_finalize',
    ptr: p_sqlite3_finalize,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        ret: retval.toString(),
            }
	    });
    },
};

const SQLiteBindInt: IFunctionPointer = {
    name: 'sqlite3_bind_int',
    ptr: p_sqlite3_bind_int,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
                args: [args[1].toString(), args[2].toString()],
            }
	    });
    },
};

const SQLiteBindNull: IFunctionPointer = {
    name: 'sqlite3_bind_null',
    ptr: p_sqlite3_bind_null,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
                args: [args[1].toString()],
            }
	    });
    },
};

const SQLiteBindInt64: IFunctionPointer = {
    name: 'sqlite3_bind_int64',
    ptr: p_sqlite3_bind_int64,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[1].toString(), args[2].toString()]
		    }
	    });
    },
};

const SQLiteBindText: IFunctionPointer = {
    name: 'sqlite3_bind_text',
    ptr: p_sqlite3_bind_text,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[1].toString(), args[2].readUtf8String()]
		    }
	    });
    },
};


const SQLiteBindDouble: IFunctionPointer = {
    name: 'sqlite3_bind_double',
    ptr: p_sqlite3_bind_double,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [args[1].toString(), args[2].toString()]
		    }
	    });
    },
};

//TODO: dà errore quando il buf è vuoto
const SQLiteBindBlob: IFunctionPointer = {
    name: 'sqlite3_bind_blob',
    ptr: p_sqlite3_bind_blob,
    onEnter: function(args: InvocationArguments){
        var length = int64(args[3].toString());
        if (length.toNumber() > 0) {
            var buf = args[2].readByteArray(length.toNumber()); //.unwrap(); //.readCString();
            send({
                type: 'sqlite',
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [args[1].toString()]
                }
            }, buf
            );
        }
        else{
            send({
                type: 'sqlite',
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [args[1].toString()]
                }
            });
        }
    },
};

const SQLiteBindBlob64: IFunctionPointer = {
    name: 'sqlite3_bind_blob64',
    ptr: p_sqlite3_bind_blob64,
    onEnter: function(args: InvocationArguments){
        var length = int64(args[3].toString());
        if (length.toNumber() > 0) {
            var buf = args[2].readByteArray(length.toNumber()); //.unwrap(); //.readCString();
            send({
                type: 'sqlite',
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [args[1].toString()]
                }
            }, buf
            );
        }
        else{
            send({
                type: 'sqlite',
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [args[1].toString()]
                }
            });
        }
    },
};

const SQLiteStep: IFunctionPointer = {
    name: 'sqlite3_step',
    ptr: p_sqlite3_step,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        ret: retval.toString(),
		    }
	    });
    },
};


//COLUMN FUNCTIONS
const SQLiteColumnCount: IFunctionPointer = {
    name: 'sqlite3_column_count',
    ptr: p_sqlite3_column_count,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [],
		        ret: retval.toString()
		    }
	    });
    },
};

const SQLiteColumnInt: IFunctionPointer = {
    name: 'sqlite3_column_int',
    ptr: p_sqlite3_column_int,
    onEnter: function(args:InvocationArguments){
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.column_id],
		        ret: retval.toString()
		    }
	    });
    },
};

const SQLiteColumnInt64: IFunctionPointer = {
    name: 'sqlite3_column_int64',
    ptr: p_sqlite3_column_int64,
    onEnter: function(args:InvocationArguments){
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.column_id],
		        ret: retval.toString(),
		    }
	    });
    },
};

const SQLiteColumnDouble: IFunctionPointer = {
    name: 'sqlite3_column_double',
    ptr: p_sqlite3_column_double,
    onEnter: function(args: InvocationArguments){
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.column_id],
		        ret: retval.toString(),
		    }
	    });
    },
};

const SQLiteColumnText: IFunctionPointer = {
    name: 'sqlite3_column_text',
    ptr: p_sqlite3_column_text,
    onEnter: function(args: InvocationArguments){
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        var r = retval.readUtf8String();
        if (r !== null && r !== ""){
            r = r.replaceAll("\n", " ");
        }
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.column_id],
		        ret: retval.readUtf8String(),
		    }
	    });
    },
};

const SQLiteColumnBytes: IFunctionPointer = {
    name: 'sqlite3_column_bytes',
    ptr: p_sqlite3_column_bytes,
    onEnter: function(args:InvocationArguments){
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.column_id],
		        ret: retval.toString(),
		    }
	    });
    },
};

const SQLiteColumnBlob: IFunctionPointer = {
    name: 'sqlite3_column_blob',
    ptr: p_sqlite3_column_blob,
    onEnter: function(args:InvocationArguments){
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        var blob = retval.readByteArray(10000);
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: this.threadId,
		    data: {
		        args: [this.column_id],
		        ret: retval.toString(),
		    }
	    },blob);
    },
};


export const sqlite_cipher_functions = [
    SQLiteOpen,
    SQLiteOpenV2,
    SQLiteOpen16,
    SQLitePrepare,
    SQLitePrepareV2,
    SQLitePrepareV3,
    SQLiteExec,
    SQLiteBindNull,
    SQLiteBindText,
    SQLiteBindInt,
    SQLiteBindInt64,
    SQLiteBindDouble,
    SQLiteBindBlob,
    SQLiteBindBlob64,
    SQLiteColumnCount,
    SQLiteColumnInt,
    SQLiteColumnInt64,
    SQLiteColumnDouble,
    SQLiteColumnText,
    SQLiteColumnBytes,
    SQLiteColumnBlob,
    SQLiteStep,
    SQLiteFinalize,
    SQLiteReset,
    //SQLiteStrAppendf,
    //SQLiteStrVappendf,
];*/