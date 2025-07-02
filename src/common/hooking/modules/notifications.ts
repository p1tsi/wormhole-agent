import ObjC from 'frida-objc-bridge';

import { IFunctionPointer } from './interfaces.js';
import { frameworkCoreFoundation, libSystemNotify } from '../../lib/libraries.js';


const NSNotificationCenter_postNotificationName_object_userInfo: IFunctionPointer = {
    name: '+[NSNotificationCenter postNotificationName:object:userInfo:]',
    ptr: ObjC.classes.NSNotificationCenter['- postNotificationName:object:userInfo:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [new ObjC.Object(args[2]).toString(),
                        new ObjC.Object(args[3]).toString(),
                        new ObjC.Object(args[4]).toString()
                      ],
            }
        });
    }
}

const NSDistributedNotificationCenter_postNotificationName_object_userInfo: IFunctionPointer = {
    name: '+[NSDistributedNotificationCenter postNotificationName:object:userInfo:]',
    ptr: ObjC.classes.NSDistributedNotificationCenter['- postNotificationName:object:userInfo:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [new ObjC.Object(args[2]).toString(),
                        new ObjC.Object(args[3]).toString(),
                        new ObjC.Object(args[4]).toString()
                      ],
            }
        });
    }
}

const NSNotificationCenter_addObserver_selector_name_object: IFunctionPointer = {
    name: '-[NSNotificationCenter addObserver:selector:name:object:]',
    ptr: ObjC.classes.NSNotificationCenter['- addObserver:selector:name:object:'].implementation,
    onEnter: function(args: InvocationArguments){
        let obj;
        try{
            obj = new ObjC.Object(args[2]).$ivars['isa'].toString();
        }
        catch (e){
            obj = "err";
        }
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [new ObjC.Object(args[4]).toString(),
                        args[3].readUtf8String(),
                        obj,
                        //new ObjC.Object(args[5]).toString(),
                      ],
            }
        });
    }
}


const NSNotificationCenter_removeObserver_name_object: IFunctionPointer = {
    name: '-[NSNotificationCenter removeObserver:name:object:]',
    ptr: ObjC.classes.NSNotificationCenter['- removeObserver:name:object:'].implementation,
    onEnter: function(args: InvocationArguments){
        try{
            let obj = new ObjC.Object(args[2]).$ivars['isa'].toString();
            let not = new ObjC.Object(args[3]).toString();
            if (not != 'nil'){
                send({
                    type: 'notifications',
                    timestamp: Date.now(),
                    symbol: this.name,
                    tid: Process.getCurrentThreadId(),
                    data: {
                        args: [not, obj]
                    }
                });
            }
        }
        catch (e){
        }
    }
}


const CFNotificationCenterAddObserver: IFunctionPointer = {
    name: 'CFNotificationCenterAddObserver',
    ptr: Process.getModuleByName(frameworkCoreFoundation).getSymbolByName("CFNotificationCenterAddObserver"),   
    onEnter: function(args: InvocationArguments){
        let notificationName = new ObjC.Object(args[3]).toString();
        if (notificationName !== "com.apple.locationd.registration"){
            send({
                type: 'notifications',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [notificationName, new ObjC.Object(args[1]).toString()],
                }
            });
        }
    }
}

const NotifyPost: IFunctionPointer = {
    name: 'notify_post',
    ptr: Process.getModuleByName(libSystemNotify).getSymbolByName('notify_post'),
    onEnter: function(args: InvocationArguments){
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [args[0].readUtf8String()],
            }
        });
    }
}

const NotifyRegisterDispatch: IFunctionPointer = {
    name: 'notify_register_dispatch',
    ptr: Process.getModuleByName(libSystemNotify).getSymbolByName('notify_register_dispatch'),
    onEnter: function(args: InvocationArguments){
        this.notificationName = args[0].readUtf8String();
        this.token = args[1];
    },
    onLeave: function(retval: NativePointer){
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [this.notificationName, this.token.readU32()],
            }
        });
    }
}

const NotifyCancel: IFunctionPointer = {
    name: 'notify_cancel',
    ptr: Process.getModuleByName(libSystemNotify).getSymbolByName('notify_cancel'),
    onEnter: function(args: InvocationArguments){
        if (!args[0].isNull()){
            send({
                type: 'notifications',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [args[0]],
                }
            });
        }
    }
}

const NotifyGetState: IFunctionPointer = {
    name: 'notify_get_state',
    ptr: Process.getModuleByName(libSystemNotify).getSymbolByName('notify_get_state'),
    onEnter: function(args: InvocationArguments){
        if (!args[0].isNull()){
            send({
                type: 'notifications',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [args[0]],
                }
            });
        }
    }
}


const CFNotificationCenterPostNotificationWithOptions: IFunctionPointer = {
    name: 'CFNotificationCenterPostNotificationWithOptions',
    ptr: Process.getModuleByName(frameworkCoreFoundation).getSymbolByName('CFNotificationCenterPostNotificationWithOptions'),
    onEnter: function(args: InvocationArguments){
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [new ObjC.Object(args[1]).toString(),
                        new ObjC.Object(args[2]).toString(),
                        new ObjC.Object(args[3]).toString()
                      ],
            }
        });
    }
}

const CFNotificationCenterPostNotification: IFunctionPointer = {
    name: 'CFNotificationCenterPostNotification',
    ptr: Process.getModuleByName(frameworkCoreFoundation).getSymbolByName('CFNotificationCenterPostNotification'),
    onEnter: function(args: InvocationArguments){
        send({
            type: 'notifications',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [new ObjC.Object(args[1]).toString(),
                        new ObjC.Object(args[2]).toString(),
                        new ObjC.Object(args[3]).toString()
                      ],
            }
        });
    }
}


export const notifications_functions = [
    NSNotificationCenter_postNotificationName_object_userInfo,
    //NSDistributedNotificationCenter_postNotificationName_object_userInfo,
    NSNotificationCenter_addObserver_selector_name_object,
    //NSNotificationCenter_removeObserver_name_object,
    //CFNotificationCenterAddObserver,
    //NotifyPost,
    //NotifyRegisterDispatch,
    //NotifyCancel
    //CFNotificationCenterPostNotificationWithOptions, //called inside CFNotificationCenterPostNotification
    CFNotificationCenterPostNotification
]
