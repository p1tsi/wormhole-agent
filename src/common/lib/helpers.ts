import ObjC from "frida-objc-bridge";

export function ObjCObjectTOJSONString(object: NativePointer) {
  let msgData =
    ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(
      object,
      0,
      ptr("0x0"),
    );
  let msgString = ObjC.classes.NSString.alloc().initWithData_encoding_(
    msgData,
    4,
  );
  return msgString.toString();
}

export function bytesToB64NSString(data) {
  if (!data) {
    return "";
  }
  let b64data = data.base64EncodedDataWithOptions_(0);
  return ObjC.classes.NSString.alloc().initWithData_encoding_(b64data, 4);
}

export function NSDateToNSString(date) {
  if (!date) {
    return "";
  }
  let formatter = ObjC.classes.NSDateFormatter.alloc().init();
  formatter.setDateFormat_(
    ObjC.classes.NSString.stringWithUTF8String_(
      Memory.allocUtf8String("yyyy-MM-dd HH:mm:ss Z"),
    ),
  );
  return formatter.stringFromDate_(date);
}

const NSPropertyListImmutable = 0;
type Dictionary = { [key: string]: any };

export function valueOf(value: ObjC.Object): any {
  const { NSArray, NSDictionary, NSNumber, __NSCFBoolean } = ObjC.classes;
  if (value === null || typeof value !== "object") return value;
  if (value.isKindOfClass_(__NSCFBoolean)) return value.boolValue();
  if (value.isKindOfClass_(NSArray)) return arrayFromNSArray(value);
  if (value.isKindOfClass_(NSDictionary)) return dictFromNSDict(value);
  if (value.isKindOfClass_(NSNumber)) return parseFloat(value.toString());
  return value.toString();
}

export function dictFromBytes(
  address: NativePointer,
  size: number,
): Dictionary {
  const { NSData, NSPropertyListSerialization } = ObjC.classes;
  const format = Memory.alloc(Process.pointerSize);
  const err = Memory.alloc(Process.pointerSize).writePointer(NULL);
  const data = NSData.dataWithBytesNoCopy_length_freeWhenDone_(
    address,
    size,
    0,
  );
  const dict =
    NSPropertyListSerialization.propertyListFromData_mutabilityOption_format_errorDescription_(
      data,
      NSPropertyListImmutable,
      format,
      err,
    );

  const desc = err.readPointer();
  if (!desc.isNull()) throw new Error(new ObjC.Object(desc).toString());

  return dictFromNSDict(dict);
}

export function dictFromNSDict(nsDict: ObjC.Object): Dictionary {
  const jsDict: { [key: string]: any } = {};
  const keys = nsDict.allKeys();
  const count = keys.count();
  for (let i = 0; i < count; i++) {
    const key = keys.objectAtIndex_(i);
    const value = nsDict.objectForKey_(key);
    jsDict[key.toString()] = valueOf(value);
  }

  return jsDict;
}

export function arrayFromNSArray(
  original: ObjC.Object,
  limit: number = Infinity,
): object[] {
  const arr = [];
  const count = original.count();
  const len = Number.isNaN(limit) ? Math.min(count, limit) : count;
  for (let i = 0; i < len; i++) {
    const val = original.objectAtIndex_(i);
    arr.push(valueOf(val));
  }
  return arr;
}

export function description(obj: ObjC.Object) {
  if (!obj) return obj;
  if (obj.isKindOfClass_(ObjC.classes.NSBlock))
    return `<Block ${obj.handle}, invoke=${obj.handle.add(Process.pointerSize * 2).readPointer()}>`;
  if (obj.isKindOfClass_(ObjC.classes.__NSCFBoolean)) return obj.boolValue();
  if (obj.isKindOfClass_(ObjC.classes.NSArray))
    return `[Array of ${obj.count()} elements]`;
  if (obj.isKindOfClass_(ObjC.classes.NSDictionary))
    return `{Dictionary of ${obj.count()} entries}`;
  if (obj.isKindOfClass_(ObjC.classes.NSNumber))
    return parseFloat(obj.toString());
  if (obj.isKindOfClass_(ObjC.classes.NSString)) return obj.toString();
  if ("isa" in obj.$ivars) return `<${obj.$className} ${obj.handle}>`;
  return `<Class ${obj}>`;
}
