import ObjC from 'frida-objc-bridge';

import {
    xpc_connection_get_name,
    xpc_connection_get_pid,
    xpc_connection_get_euid,
    xpc_connection_get_egid,
    xpc_connection_get_asid,

    xpc_copy_description,
    xpc_dictionary_get_count,
    xpc_get_type,
    xpc_bool_get_value,
    xpc_uint64_get_value,
    xpc_int64_get_value,
    xpc_string_get_string_ptr,
    xpc_data_get_length,
    xpc_data_get_bytes_ptr,
    xpc_dictionary_apply,
    xpc_array_get_count,
    xpc_array_get_value,
    xpc_uuid_get_bytes,
    xpc_double_get_value,
    xpc_shmem_map,
    xpc_date_get_value,
    xpc_endpoint_copy_listener_port_4sim
} from './libFunctions.js';





export function parseXPCConnectionObject(connection: NativePointer){
    let connectionObject = ObjC.classes.NSMutableDictionary.new();
    let name = xpc_connection_get_name(connection);

    connectionObject.setObject_forKey_(name.isNull() ? 'com.apple.xpc.anonymous' : name.readUtf8String(), 'name');
    connectionObject.setObject_forKey_(xpc_connection_get_pid(connection).toUInt32(), 'pid');
    connectionObject.setObject_forKey_(xpc_connection_get_euid(connection).toUInt32(), 'euid');
    connectionObject.setObject_forKey_(xpc_connection_get_egid(connection).toUInt32(), 'egid');
    connectionObject.setObject_forKey_(xpc_connection_get_asid(connection).toUInt32(), 'asid');

    let connJsonData = ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(connectionObject, 0, ptr(0x0));
    let connJsonStr = ObjC.classes.NSString.alloc().initWithData_encoding_(connJsonData, 0x4);

    return connJsonStr.toString();
}



const p___CFBinaryPlistCreate15 = DebugSymbol.fromName('__CFBinaryPlistCreate15').address;
export const __CFBinaryPlistCreate15 = {
    name: '__CFBinaryPlistCreate15',
    ptr: p___CFBinaryPlistCreate15,
    call: new NativeFunction(p___CFBinaryPlistCreate15, 'pointer', ['pointer', 'uint64', 'pointer'])
}


function parseXPCArray(value){
    let count = xpc_array_get_count(value);
    let arr = ObjC.classes.NSMutableArray.new();
    for (let i = 0; i < count; i++){
        let item = xpc_array_get_value(value, i);
        let valueType = new ObjC.Object(xpc_get_type(item)).toString();
        if (valueType === "OS_xpc_dictionary"){
            arr.addObject_(parseXPCDictionaryObject(item));
        }
        else if (valueType === "OS_xpc_array"){
             arr.addObject_(parseXPCArray(item));
        }
        else{
            let ptr = parseXPCBaseType(valueType, item);
            arr.addObject_(ptr);
        }
    }
    return arr;
}


function parseXPCBaseType(type, value){
    let retval;
    switch (type){
        case 'OS_xpc_bool':
            retval = xpc_bool_get_value(value);
            break;
        case 'OS_xpc_uuid':
            let uuid = xpc_uuid_get_bytes(value);
            retval = ObjC.classes.NSUUID.alloc().initWithUUIDBytes_(uuid).UUIDString();
            break;
        case 'OS_xpc_int64':
            retval = xpc_int64_get_value(value).toNumber();
            break;
        case 'OS_xpc_uint64':
            retval = xpc_uint64_get_value(value).toString();
            break;
        case 'OS_xpc_double':
            retval = xpc_double_get_value(value).toString();
            break;
        case 'OS_xpc_string':
            retval = xpc_string_get_string_ptr(value).readUtf8String();
            break;
        case 'OS_xpc_null':
            retval = "NULL";
            break;
        case 'OS_xpc_data':
            let len = xpc_data_get_length(value);
            let bytesPtr = xpc_data_get_bytes_ptr(value);
            let data = ObjC.classes.NSData.dataWithBytes_length_(bytesPtr, len);

            //const bplistFmt = bytesPtr.readCString(8);
            //console.log(bplistFmt);
            /*if (bplistFmt === 'bplist15') {
                console.log(<NativePointer>__CFBinaryPlistCreate15.call(bytesPtr, len, ptr(0x0)));
            }
            else */
            /*if (bplistFmt === 'bplist00'){
                const format: NativePointer = Memory.alloc(8);
                format.writeU64(0xaaaaaaaa);
                let plist = ObjC.classes.NSPropertyListSerialization.propertyListWithData_options_format_error_(data, 0, format, ptr(0x0));
                if (plist){
                    console.log(plist.toString());
                    message.setObject_forKey_(plist, key.readUtf8String());
                }
            }
            else{*/
            data = data.base64EncodedDataWithOptions_(0);
            let bytesAsb64 = ObjC.classes.NSString.alloc();
            bytesAsb64 = bytesAsb64.initWithData_encoding_(data, 4);
            retval = bytesAsb64;
            //}
            break;
        case 'OS_xpc_shmem':
            let memAddr: NativePointer = Memory.allocUtf8String("");
            const size = xpc_shmem_map(value, memAddr);
            console.log("SH MEM: " + size + " BYTES");

            retval = "SHMEM"; //ObjC.classes.NSData.dataWithBytes_length_(memAddr, size.toNumber());
            break;
        case 'OS_xpc_date':
            retval = xpc_date_get_value(value).toString();
            break;
        case 'OS_xpc_endpoint':
            // Get endpoint port
            retval = xpc_endpoint_copy_listener_port_4sim(value);
            break;
        case 'OS_xpc_mach_send':
        case 'OS_xpc_mach_recv':
            retval = xpc_copy_description(value).readCString();
            console.log(retval);
            break;
        case 'OS_xpc_fd':
            retval = xpc_copy_description(value).readCString();
            break;
        default:
            let content = new ObjC.Object(value);
            console.log("TODO:", content.toString())
            console.log(hexdump(content));
            retval = content.toString();
            break;
    }
    return retval;
}



export function parseXPCDictionaryObject(XPCMessage: NativePointer){
    //console.log(new ObjC.Object(XPCMessage));
    let message = ObjC.classes.NSMutableDictionary.new();
    if (xpc_dictionary_get_count(XPCMessage).toNumber() > 0){
        //console.log("XPC DICTIONARY COUNT: " + xpc_dictionary_get_count(XPCMessage).toNumber())
        const block = function(key: NativePointer, value: NativePointer): boolean {
            let valueType = new ObjC.Object(xpc_get_type(value)).toString();
            //console.log(key.readUtf8String())
            //console.log(valueType)
            //console.log(value)
            if (valueType == 'OS_xpc_dictionary'){
                message.setObject_forKey_(parseXPCDictionaryObject(value), key.readUtf8String());
            }
            else if (valueType == 'OS_xpc_array'){
                message.setObject_forKey_(parseXPCArray(value), key.readUtf8String());
            }
            else{
                message.setObject_forKey_(parseXPCBaseType(valueType, value), key.readUtf8String());
            }
            return true;
        };

        const applierBlock = new ObjC.Block({
            implementation: block,
            retType: 'bool',
            argTypes: ['pointer', 'pointer']
        });
        xpc_dictionary_apply(XPCMessage, applierBlock);
    }

    let jsonData = ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(message, 0, ptr(0x0));
    let resultMessage = ObjC.classes.NSString.alloc().initWithData_encoding_(jsonData, 0x4);
    //console.log(">", resultMessage);

    return resultMessage.toString();
}


