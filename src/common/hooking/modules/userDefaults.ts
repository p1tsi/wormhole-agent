import ObjC from 'frida-objc-bridge';

import { IFunctionPointer } from './interfaces.js';
import { cleanDictionary } from '../utils.js';


const NSUserDefaults_synchronize_: IFunctionPointer = {
    name: '-[NSUserDefaults synchronize]',
    ptr: ObjC.classes.NSUserDefaults['- synchronize'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'userdefaults',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                ret: cleanDictionary(new ObjC.Object(args[0]).dictionaryRepresentation())
            }
        });
    },
}

const NSUserDefaults_standardUserDefaults: IFunctionPointer = {
    name: '+[NSUserDefaults standardUserDefaults]',
    ptr: ObjC.classes.NSUserDefaults['+ standardUserDefaults'].implementation,
    onLeave: function(retval: NativePointer){
        send({
            type: 'userdefaults',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                ret: cleanDictionary(new ObjC.Object(retval).dictionaryRepresentation()),
            }
        });
    }
}


/*const NSUserDefaults_setObject_forKey_: IFunctionPointer = {
    name: '-[NSUserDefaults setObject:forKey:]',
    ptr: ObjC.classes.NSUserDefaults['- setObject:forKey:'].implementation,
    onEnter: function(args: InvocationArguments){
        this.object = new ObjC.Object(args[2]);
        if (this.object.$className === ObjC.classes.NSConcreteMutableData.$className ||
                this.object.$className === ObjC.classes._NSInlineData.$className){
            var size = this.object.length();
            send({
                type: 'userDefaults',
                timestamp: Date.now(),
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [new ObjC.Object(args[3]).toString()],
                }
            }, args[2].readByteArray(size));
        }
        else{
            send({
                type: 'userDefaults',
                timestamp: Date.now(),
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [new ObjC.Object(args[2]).toString(), new ObjC.Object(args[3]).toString()],
                }
            });
        }
    }
};

const NSUserDefaults_removeObjectForKey_: IFunctionPointer = {
    name: '-[NSUserDefaults removeObjectForKey:]',
    ptr: ObjC.classes.NSUserDefaults['- removeObjectForKey:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'userDefaults',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [new ObjC.Object(args[2]).toString()],
            }
        });
    }
};*/

export const user_defaults_functions = [
    NSUserDefaults_synchronize_,
    //NSUserDefaults_objectForKey_,
    //NSUserDefaults_standardUserDefaults,
    //NSUserDefaults_setObject_forKey_,
    //NSUserDefaults_removeObjectForKey_,
]