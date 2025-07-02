import ObjC from 'frida-objc-bridge';
import { IFunctionPointer } from './interfaces.js';

const ubiquityIdentityToken : IFunctionPointer = {
    name: '-[NSFileManager ubiquityIdentityToken]',
    ptr: ObjC.classes.NSFileManager['- ubiquityIdentityToken'].implementation,
    onLeave: function(retval: NativePointer){
        if (!retval.isNull()){
            send({
                type: 'icloud',
                timestamp: Date.now(),
                symbol: this.name,
                tid: this.threadId,
                data: {
                    args: [new ObjC.Object(retval).base64EncodedStringWithOptions_(0).toString()]
                }
            });
            return;
        }
    }
}

const startDownloadingUbiquitousItemAtURL_error_:  IFunctionPointer = {
    name: '-[NSFileManager startDownloadingUbiquitousItemAtURL:error:]',
    ptr: ObjC.classes.NSFileManager['- startDownloadingUbiquitousItemAtURL:error:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'icloud',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [new ObjC.Object(args[2]).path().toString()]
            }
        });
    }
}

const URLForUbiquityContainerIdentifier_:  IFunctionPointer = {
    name: '-[NSFileManager URLForUbiquityContainerIdentifier:]',
    ptr: ObjC.classes.NSFileManager['- URLForUbiquityContainerIdentifier:'].implementation,
    onEnter: function(args: InvocationArguments){
        this.id = new ObjC.Object(args[2]).toString();
    },
    onLeave: function(retval: NativePointer){
        send({
            type: 'icloud',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [this.id],
                ret: new ObjC.Object(retval).path().toString()
            }
        });
    }
}

const evictUbiquitousItemAtURL_error_:  IFunctionPointer = {
    name: '-[NSFileManager evictUbiquitousItemAtURL:error:]',
    ptr: ObjC.classes.NSFileManager['- evictUbiquitousItemAtURL:error:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'icloud',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [new ObjC.Object(args[2]).path().toString()],
            }
        });
    }
}

const setUbiquitous_itemAtURL_destinationURL_error_:  IFunctionPointer = {
    name: '-[NSFileManager setUbiquitous:itemAtURL:destinationURL:error:]',
    ptr: ObjC.classes.NSFileManager['- setUbiquitous:itemAtURL:destinationURL:error:'].implementation,
    onEnter: function(args: InvocationArguments){
        send({
            type: 'icloud',
            timestamp: Date.now(),
            symbol: this.name,
            tid: this.threadId,
            data: {
                args: [
                    new ObjC.Object(args[3]).path().toString(),
                    new ObjC.Object(args[4]).path().toString(),
                    args[2]
                ],
            }
        });
    }
}

export const icloud_functions = [
    ubiquityIdentityToken,
    startDownloadingUbiquitousItemAtURL_error_,
    URLForUbiquityContainerIdentifier_,
    evictUbiquitousItemAtURL_error_,
    setUbiquitous_itemAtURL_destinationURL_error_
]

