import ObjC from 'frida-objc-bridge';
import { IFunctionPointer } from './interfaces.js';
import { frameworkSecurity } from '../../lib/libraries.js';


function base64StringFromObject(obj){
    return ObjC.classes.NSString.alloc().initWithData_encoding_(
        obj, //.base64EncodedDataWithOptions_(0),
        4
    )
}

function cleanDictionary(dictionary){
    let res = ObjC.classes.NSMutableDictionary.new();
    let keys = dictionary.allKeys();
    let keysCount = keys.count();
    for (let i = 0; i < keysCount; i++){
        let key = keys.objectAtIndex_(i);
        if (dictionary.objectForKey_(key).isKindOfClass_(ObjC.classes.NSData)){
            res.addObject_forKey_(
                base64StringFromObject(dictionary.objectForKey_(key).base64EncodedDataWithOptions_(0)),
                key
            );
        }
        else{
            res.addObject_forKey_(
                dictionary.objectForKey_(key),
                key
            );
        }
    }
    return res.toString();
}

const SecItemCopyMatching : IFunctionPointer = {
    name: 'SecItemCopyMatching',
    ptr: Process.getModuleByName(frameworkSecurity).getSymbolByName('SecItemCopyMatching'),
    onEnter: function(args: InvocationArguments){
        this.query = new ObjC.Object(args[0]);
        let keys = this.query.allKeys();
        let keysCount = keys.count();
        let finalQuery = ObjC.classes.NSMutableDictionary.new();
        for (let i = 0; i < keysCount; i++){
            let key = keys.objectAtIndex_(i);
            let obj = this.query.objectForKey_(key);
            if (obj && obj.isKindOfClass_(ObjC.classes.NSData)){
                finalQuery.addObject_forKey_(
                    base64StringFromObject(this.query.objectForKey_(key)),
                    key
                );
            }
            else{
                finalQuery.addObject_forKey_(
                    this.query.objectForKey_(key),
                    key
                );
            }
        }
        this.query = finalQuery;
        this.resultPointer = args[1];
    },
    onLeave: function(retval: NativePointer){
        if (!retval.isNull()){
            send({
                type: 'keychain',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [this.query.toString(), null]
                }
            });
            return;
        }

        let res = null;
        let p = this.resultPointer.readPointer();
        if (!p.isNull()){
            let output = new ObjC.Object(p);
            if (output.isKindOfClass_(ObjC.classes.NSDictionary)){
                res = cleanDictionary(output);
            }
            else if (output.isKindOfClass_(ObjC.classes.NSData)){
                res = base64StringFromObject(output.base64EncodedDataWithOptions_(0)).toString();
            }
            else if (output.isKindOfClass_(ObjC.classes.NSArray)){
                let tmpArr = ObjC.classes.NSMutableArray.new();
                let count = output.count();
                for (let i = 0; i < count; i++){
                    let d = new ObjC.Object(output.objectAtIndex_(i));
                    tmpArr.addObject_(cleanDictionary(d));
                }
                res = tmpArr.toString();
            }
            else{
                res = output.toString();
            }
            send({
                type: 'keychain',
                timestamp: Date.now(),
                symbol: this.name,
                tid: Process.getCurrentThreadId(),
                data: {
                    args: [this.query.toString(), res]
                }
            });
        }
    }
}

const SecItemAdd : IFunctionPointer = {
    name: 'SecItemAdd',
    ptr: Process.getModuleByName(frameworkSecurity).getSymbolByName('SecItemAdd'),
    onEnter: function(args: InvocationArguments){
        let query = new ObjC.Object(args[0]);
        query = cleanDictionary(query);
        send({
            type: 'keychain',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [query.toString()]
            }
        });
    }
}

const SecItemDelete : IFunctionPointer = {
    name: 'SecItemDelete',
    ptr: Process.getModuleByName(frameworkSecurity).getSymbolByName('SecItemDelete'),
    onEnter: function(args: InvocationArguments){
        let query = new ObjC.Object(args[0]);
        query = cleanDictionary(query);
        send({
            type: 'keychain',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [query.toString()]
            }
        });
    }
}

const SecItemUpdate : IFunctionPointer = {
    name: 'SecItemUpdate',
    ptr: Process.getModuleByName(frameworkSecurity).getSymbolByName('SecItemUpdate'),
    onEnter: function(args: InvocationArguments){
        send({
            type: 'keychain',
            timestamp: Date.now(),
            symbol: this.name,
            tid: Process.getCurrentThreadId(),
            data: {
                args: [new ObjC.Object(args[0]).toString(), new ObjC.Object(args[1]).toString()]
            }
        });
    }
}

export const keychain_functions = [
    SecItemCopyMatching,
    SecItemAdd,
    SecItemDelete,
    SecItemUpdate
]