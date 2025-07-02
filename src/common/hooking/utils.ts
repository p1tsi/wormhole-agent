
import ObjC from "frida-objc-bridge";

export function base64StringFromObject(obj){
    return ObjC.classes.NSString.alloc().initWithData_encoding_(
        obj, //.base64EncodedDataWithOptions_(0),
        4
    )
}

export function cleanDictionary(dictionary){
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