import { IFunctionPointer } from './interfaces.js';
import { libSQLiteDylib } from '../../lib/libraries.js';


//DB STUFF
const p_sqlite3_open = Process.getModuleByName(libSQLiteDylib).getSymbolByName("sqlite3_open");
const p_sqlite3_open16 = Process.getModuleByName(libSQLiteDylib).getSymbolByName("sqlite3_open16");
const p_sqlite3_open_v2 = Process.getModuleByName(libSQLiteDylib).getSymbolByName("sqlite3_open_v2");

// QUERIES ROUTINE
const p_sqlite3_prepare = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_prepare');
const p_sqlite3_prepare_v2 = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_prepare_v2');
const p_sqlite3_prepare_v3 = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_prepare_v3');
const p_sqlite3_str_appendf = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_str_appendf');
const p_sqlite3_str_vappendf = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_str_vappendf');
const p_sqlite3_step = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_step');
const p_sqlite3_exec = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_exec');
const p_sqlite3_reset = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_reset');
const p_sqlite3_finalize = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_finalize');

// PARAMS BIND
const p_sqlite3_bind_text = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_text');
const p_sqlite3_bind_int = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_int');
const p_sqlite3_bind_int64 = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_int64');
const p_sqlite3_bind_double = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_double');
const p_sqlite3_bind_blob = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_blob');
const p_sqlite3_bind_blob64 = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_blob64');
const p_sqlite3_bind_null = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_bind_null');


// GET RESULTS
const p_sqlite3_column_int = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_int');
const p_sqlite3_column_int64 = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_int64');
const p_sqlite3_column_double = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_double');
const p_sqlite3_column_text = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_text');
const p_sqlite3_column_bytes = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_bytes');
const p_sqlite3_column_count = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_count');
const p_sqlite3_column_blob = Process.getModuleByName(libSQLiteDylib).getSymbolByName('sqlite3_column_blob');

// int sqlite3_column_bytes(sqlite3_stmt*, int iCol);
const sqlite3_column_bytes_handle = new NativeFunction(p_sqlite3_column_bytes, "int", ["pointer", "pointer"]);


const SQLiteOpen: IFunctionPointer = {
    name: 'sqlite3_open',
    ptr: p_sqlite3_open,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
		    tid: Process.getCurrentThreadId(),
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
        this.timestamp = Date.now();
        this.query = args[1].readUtf8String();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
		    tid: Process.getCurrentThreadId(),
		    timestamp: this.timestamp,
            symbol: this.name,
		    data: {
		        args: [this.query],
		        ret: retval.toString()
            }
	    });
    }
};

const SQLiteReset: IFunctionPointer = {
    name: 'sqlite3_reset',
    ptr: p_sqlite3_reset,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
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
		    tid: Process.getCurrentThreadId(),
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
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [args[1].readUtf8String() ]
            }
	    });
    }
};

const SQLitePrepareV3: IFunctionPointer = {
    name: 'sqlite3_prepare_v3',
    ptr: p_sqlite3_prepare_v3,
    onEnter: function(args: InvocationArguments){
        let query = args[1].readUtf8String().replaceAll("\n", " ").replaceAll("    ", "");
        send({
		    type: 'sqlite',
		    symbol: this.name,
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [query]
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
		    tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
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
        this.timestamp = Date.now();
        let length = int64(args[3].toString());
        if (length.toNumber() > 0) {
            let buf = args[2].readByteArray(length.toNumber());
            send({
                type: 'sqlite',
                symbol: this.name,
                timestamp: this.timestamp,
                tid: Process.getCurrentThreadId(),
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
                timestamp: this.timestamp,
                tid: Process.getCurrentThreadId(),
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
        this.timestamp = Date.now();
        let length = int64(args[3].toString());
        if (length.toNumber() > 0) {
            let buf = args[2].readByteArray(length.toNumber()); //.unwrap(); //.readCString();
            send({
                type: 'sqlite',
                symbol: this.name,
                timestamp: this.timestamp,
                tid: Process.getCurrentThreadId(),
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
                timestamp: this.timestamp,
                tid: Process.getCurrentThreadId(),
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
            tid: Process.getCurrentThreadId(),
		    data: {
		        ret: retval.toString(),
		    }
	    });
    },
};

/*
COLUMN FUNCTIONS
*/
const SQLiteColumnCount: IFunctionPointer = {
    name: 'sqlite3_column_count',
    ptr: p_sqlite3_column_count,
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
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
        this.timestamp = Date.now();
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            timestamp: this.timestamp,
            tid: Process.getCurrentThreadId(),
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
        this.timestamp = Date.now();
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            timestamp: this.timestamp,
            tid: Process.getCurrentThreadId(),
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
        this.timestamp = Date.now();
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            timestamp: this.timestamp,
            tid: Process.getCurrentThreadId(),
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
    onEnter: function(args:InvocationArguments){
        this.timestamp = Date.now();
        this.column_id = args[1].toString();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'sqlite',
            symbol: this.name,
            timestamp: this.timestamp,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.column_id],
		        ret: retval.readUtf8String(),
		    }
	    });
    },
};

const SQLiteColumnBlob: IFunctionPointer = {
    name: 'sqlite3_column_blob',
    ptr: p_sqlite3_column_blob,
    onEnter: function(args:InvocationArguments){
        this.timestamp = Date.now();
        this.column_id = args[1].toString();
        this.length = sqlite3_column_bytes_handle(args[0], args[1]);
    },
    onLeave: function(retval: NativePointer){
        let blob = retval.readByteArray(this.length);
        send({
		    type: 'sqlite',
            symbol: this.name,
            timestamp: this.timestamp,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.column_id]
		    }
	    }, blob);
    },
};

export const sqlite_functions = [
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
    SQLiteColumnBlob,
    SQLiteStep,
    SQLiteFinalize,
    SQLiteReset,
    //SQLiteStrAppendf,
    //SQLiteStrVappendf,
];