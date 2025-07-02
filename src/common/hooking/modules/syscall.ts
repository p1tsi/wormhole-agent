import ObjC from 'frida-objc-bridge';

import { IFunctionPointer } from './interfaces.js';
import {
    libSystemKernel,
} from '../../lib/libraries/libsystem_kernel.js';

import {
    libSystemC
} from '../../lib/libraries/libsystem_c.js'

const mac_syscall: IFunctionPointer = {
    name: '__mac_syscall',
    ptr: Process.getModuleByName(libSystemKernel).getSymbolByName('__mac_syscall'),
    onEnter: function(args: InvocationArguments){
        this.policy = args[0].readUtf8String();
        this.commandId = args[1].toString();
        this.arg = null;
        if (!args[2].isNull()){
            this.arg = args[2].toString();
        }
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'syscall',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.policy, this.commandId, this.arg],
		        ret: retval
            }
	    });
    }
}

const sysctl: IFunctionPointer = {
    name: 'sysctl',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName('sysctl'),
    onEnter: function(args: InvocationArguments){
        this.mibLen = args[1];
        this.mib = "["
        for (let i = 0; i < args[1].toInt32(); i++){
            this.mib += args[0].add(0x4 * i).readU32();
            this.mib += ","
        }
        this.mib += ']';

        this.oldp = args[2];
        this.oldpLen = args[3];

        this.newp = args[4];
        this.newpLen = args[5];
    },
    onLeave: function(retval: NativePointer){
        var oldD = null;
        var newD = null;

        if (!this.oldp.isNull() && this.oldpLen.readInt() > 0){
            let oldData = ObjC.classes.NSData.dataWithBytes_length_(this.oldp, this.oldpLen.readInt());
            oldD = oldData.base64EncodedStringWithOptions_(0).toString();
        }

        if (this.newpLen > 0){
            let newData = ObjC.classes.NSData.dataWithBytes_length_(this.newp, this.newpLen);
            newD = newData.base64EncodedStringWithOptions_(0).toString();
        }

        send({
		    type: 'syscall',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.mib, this.mibLen, oldD, newD],
		        ret: retval
            }
	    });
    }
}

const sysctlbyname: IFunctionPointer = {
    name: 'sysctlbyname',
    ptr: Process.getModuleByName(libSystemC).getSymbolByName('sysctlbyname'),
    onEnter: function(args: InvocationArguments){
        this.propName = args[0].readUtf8String();

        this.oldp = args[1];
        this.oldpLen = args[2];

        this.newp = args[3];
        this.newpLen = args[4];
    },
    onLeave: function(retval: NativePointer){
        var oldD = ptr(0x0);
        var newD = ptr(0x0);

        if (!this.oldp.isNull() && this.oldpLen.readInt() > 0){
            let oldData = ObjC.classes.NSData.dataWithBytes_length_(this.oldp, this.oldpLen.readInt());
            oldD = oldData.base64EncodedStringWithOptions_(0).toString();
        }

        if (this.newpLen > 0){
            let newData = ObjC.classes.NSData.dataWithBytes_length_(this.newp, this.newpLen);
            newD = newData.base64EncodedStringWithOptions_(0).toString();
        }

        send({
		    type: 'syscall',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.propName, oldD, newD],
		        ret: retval
            }
	    });
    }
}


const renameat: IFunctionPointer = {
    name: 'renameat',
    ptr: Process.getModuleByName(libSystemKernel).getSymbolByName('renameat'),
    onEnter: function(args: InvocationArguments){
        this.old = args[1].readUtf8String();
        this.new = args[3].readUtf8String();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'syscall',
		    timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
		    data: {
		        args: [this.old, this.new],
		        ret: retval
            }
	    });
    }
}

export const syscall_functions = [
    mac_syscall,
    sysctl,
    sysctlbyname,
    renameat
]