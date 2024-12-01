///!!! DEPRECATED !!!///

import { objc_copyClassNamesForImage, free } from './lib/functions'
import { bytesToB64NSString, NSDateToNSString, ObjCObjectTOJSONString } from './lib/helpers'


export function getTargetInfo(info){

    let targetInfo: Object = {};
    let res: Object = {};

    info.forEach(x => {
        if (x === "mainBundle"){
            res = dumpMainBundle();
        }
        else if (x === "bundles"){
            res = dumpBundles();
        }
        else if (x === "frameworks"){
            res = dumpFrameworks();
        }
        else if (x === "userDefaults"){
            res = dumpUserDefaults();
        }
        else if (x === "infoPlist"){
            res = dumpInfoPlist();
        }
        else if (x === "classes"){
            res = dumpClassesByFramework(ObjC.classes.NSBundle.mainBundle().executablePath().UTF8String());
        }
        else if (x === "threads"){
            res = dumpThreads();
        }
        else if (x === "httpCookies"){
            res = dumpHTTPCookies();
        }
        else if (x === "keychain"){
            res = dumpKeychain();
        }
        targetInfo[x] = res;
    });

    return targetInfo;

    // threads,
    // heap,
    // allocated classes
}

export function dumpClassesByFramework(framework){
    if (ObjC.available){
        let p = Memory.alloc(Process.pointerSize);
        p.writeUInt(0);
        let pPath = Memory.allocUtf8String(framework);
        let pClasses = objc_copyClassNamesForImage(pPath, p);
        let count = p.readUInt();
        let classes = new Array(count);
        for (let i = 0; i < count; i++) {
            let className = pClasses.add(i * Process.pointerSize).readPointer().readUtf8String();
            className = getClassSuperClass(className);
            classes[i] = className;
        }
        free(pClasses);
        return classes;
    }
    else{
        return "";
    }
}

function dumpMainBundle(){
    if (ObjC.available){
        return ObjC.classes.NSBundle.mainBundle().bundlePath().toString();
    }
    else{
        return "";
    }
}



function getClassSuperClass(className){
    if (className == "NSObject" || className == "_TtCs12_SwiftObject"){
        return className;
    }
    /*if (className.startsWith("UI")){
        return " : " + className + " : ...";
    }*/
    let superClass = ObjC.classes[className].$superClass;
    if (!superClass){
        return "null"; // + getClassSuperClass(superClass);
    }
    return className + " : " + getClassSuperClass(superClass.toString());
}

function dumpBundles(){
    if (ObjC.available){
        let bundles = ObjC.classes.NSBundle.allBundles();
        const bundlesLength: number = bundles.count().valueOf();
        let bundlesArray: Array<string> = [];
        for (let i = 0; i < bundlesLength; i++) {
            bundlesArray.push(bundles.objectAtIndex_(i).bundlePath());
        }
        return bundlesArray.toString();
    }
    else{
        return "";
    }
}

function dumpFrameworks(){
    if (ObjC.available){
        let frameworks = ObjC.classes.NSBundle.allFrameworks();
        const frameworksLength: number = frameworks.count().valueOf();
        let frameworksArray: Array<string> = [];
        for (let i = 0; i < frameworksLength; i++){
            frameworksArray.push(frameworks.objectAtIndex_(i).bundlePath());
        }
        return frameworksArray.toString();
    }
    else{
        return "";
    }
}


function dumpUserDefaults(){
    if (ObjC.available){
        let mutableUserDefaults = ObjC.classes.NSMutableDictionary.dictionaryWithDictionary_(
            ObjC.classes.NSUserDefaults.standardUserDefaults().dictionaryRepresentation()
        );
        let keys = mutableUserDefaults.allKeys();
        for (let i = 0; i < mutableUserDefaults.count(); i++){
            //console.log(keys.objectAtIndex_(i));
            let object = mutableUserDefaults.objectForKey_(keys.objectAtIndex_(i));
            if (object.$className.indexOf("Data") > 0){
                mutableUserDefaults.setObject_forKey_(bytesToB64NSString(object), keys.objectAtIndex_(i));
            }
            if (object.$className.indexOf("Date") > 0){
                mutableUserDefaults.setObject_forKey_(NSDateToNSString(object), keys.objectAtIndex_(i));
            }
        }
        return ObjCObjectTOJSONString(mutableUserDefaults);
    }
    else{
        return "";
    }
}

function dumpInfoPlist(){
    if (ObjC.available){
        return ObjC.classes.NSBundle.mainBundle().infoDictionary().toString();
    }
    else{
        return "";
    }
}

function dumpThreads(){
    return Process.enumerateThreads();
}

function dumpHTTPCookies(){
    if (ObjC.available){
        const cookieStorage = ObjC.classes.NSHTTPCookieStorage.sharedHTTPCookieStorage();
        const cookieJar = cookieStorage.cookies();
        const cookies = [];

        for (let i = 0; i < cookieJar.count(); i++) {
            let cookie = cookieJar.objectAtIndex_(i)
            const item = {
                version: cookie.version().toString(),
                name: cookie.name().toString(),
                value: cookie.value().toString(),
                expiresDate: cookie.expiresDate() ? cookie.expiresDate().toString() : "NULL",
                sessionOnly: cookie.isSessionOnly().toString(),
                domain: cookie.domain().toString(),
                path: cookie.path().toString(),
                isSecure: cookie.isSecure().toString(),
                httpOnly: cookie.isHTTPOnly().toString(),
                sameSitePolicy: cookie.sameSitePolicy() ? cookie.sameSitePolicy().toString() : "NULL",
            };
            cookies.push(item)
        }
        return cookies;
    }
    else{
        return "";
    }
}


enum kSec {
    // CLASSES
    kSecClass = "class",
    kSecClassKey = "keys",
    kSecClassIdentity = "idnt",
    kSecClassCertificate = "cert",
    kSecClassGenericPassword = "genp",
    kSecClassInternetPassword = "inet",

    // GENERAL ATTRIBUTES KEYS
    kSecAttrAccessGroup = "agrp",
    kSecAttrLabel = "labl",
    kSecAttrCreationDate = "cdat",
    kSecAttrAccessControl = "accc",
    kSecAttrSynchronizable = "sync",
    kSecAttrSynchronizableAny = "syna",
    kSecAttrModificationDate = "mdat",
    kSecAttrDescription = "desc",
    kSecAttrComment = "icmt",
    kSecAttrCreator = "crtr",
    kSecAttrType = "type",
    kSecAttrScriptCode = "scrp",
    kSecAttrAlias = "alis",
    kSecAttrIsInvisible = "invi",
    kSecAttrIsNegative = "nega",
    kSecAttrHasCustomIcon = "cusi",
    kSecAttrAccessible = "pdmn",
    kSecAttrAccessibleWhenUnlocked = "ak",
    kSecAttrAccessibleAfterFirstUnlock = "ck",
    kSecAttrAccessibleAlways = "dk",
    kSecAttrAccessibleWhenUnlockedThisDeviceOnly = "aku",
    kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly = "akpu",
    kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly = "cku",
    kSecAttrAccessibleAlwaysThisDeviceOnly = "dku",
    // kSecAttrSyncViewHint
    // kSecAttrPersistantReference
    kSecAttrPersistentReference = "persistref",

    // PASSWORD ATTRIBUTES KEYS
    kSecAttrService = "svce",
    kSecAttrAccount = "acct",
    kSecAttrGeneric = "gena",
    kSecAttrServer = "srvr",
    //kSecAttrSecurityDomain
    //kSecAttrProtocol
    //kSecAttrAuthenticationType
    //kSecAttrPort
    //kSecAttrPath

    // CERTIFICATE ATTRIBUTES
    //kSecAttrSubject
    //kSecAttrIssuer
    //kSecAttrSerialNumber
    //kSecAttrSubjectKeyID
    //kSecAttrPublicKeyHash
    //kSecAttrCertificateType
    //kSecAttrCertificateEncoding

    // CRYPTOGRAPHIC KEY ATTRIBUTES KEYS

    // CRYPTOGRAPHIC KEY USAGE ATTRIBUTES KEYS

    // KEY CLASS VALUES
    //kSecAttrKeyClassPublic
    //kSecAttrKeyClassPrivate
    //kSecAttrKeyClassSymmetric

    // ACCESSIBILITY VALUES


    kSecProtectedDataItemAttr = "prot",
    kSecReturnAttributes = "r_Attributes",
    kSecReturnData = "r_Data",
    kSecReturnRef = "r_Ref",
    kSecMatchLimit = "m_Limit",
    kSecMatchLimitAll = "m_LimitAll",
    kSecValueData = "v_Data",
}

const itemClasses = [
  kSec.kSecClassKey,
  kSec.kSecClassIdentity,
  kSec.kSecClassCertificate,
  kSec.kSecClassGenericPassword,
  kSec.kSecClassInternetPassword,
];

const SecItemCopyMatching = new NativeFunction(Module.getExportByName('Security', 'SecItemCopyMatching'), "pointer", ["pointer", "pointer"])


function bytesToUTF8(data: any){
    if (data === null) {
        return "";
    }

    if (!data.hasOwnProperty("bytes")) {
            return data.toString();
    }

    const s = ObjC.classes.NSString.alloc().initWithBytes_length_encoding_(
    data.bytes(), data.length(), 4);

    if (s) {
        return s.UTF8String();
    }

    return "";
}


const bytesToHexString = (data: any): string => {
  // https://stackoverflow.com/a/50767210
  if (data == null) {
    return "";
  }
  const buffer: ArrayBuffer = data.bytes().readByteArray(data.length());
  return Array.from(new Uint8Array(buffer)).map((b) => ("0" + b.toString(16)).substring(-2)).join("");
};


export function reverseEnumLookup<T>(enumType: T, value: string): string | undefined {
    for (const key in enumType) {
        if (Object.hasOwnProperty.call(enumType, key) && enumType[key] as any === value) {
            return key;
        }
    }
    return undefined;
}


const SecAccessControlGetConstraints = new NativeFunction(Module.getExportByName("Security", "SecAccessControlGetConstraints"), "pointer", ["pointer"]) ;

function unArchiveDataAndGetString(data: ObjC.Object | any){

  try {
    const NSKeyedUnarchiver = ObjC.classes.NSKeyedUnarchiver;
    const unArchivedData: any = NSKeyedUnarchiver.unarchiveTopLevelObjectWithData_error_(data, NULL);

    if (unArchivedData === null) {
      return ``;
    }

    switch (unArchivedData.$className) {

      case "__NSDictionary":
      case "__NSDictionaryI":
        const dict = new ObjC.Object(unArchivedData);
        const enumerator = dict.keyEnumerator();
        let key;
        const s: object = {};

        while ((key = enumerator.nextObject()) !== null) {
          s[key] = `${dict.objectForKey_(key)}`;
        }

        return JSON.stringify(s);

      default:
        return ``;
    }

  } catch (e) {
    return data.toString();
  }
}


function smartDataToString(raw: any){

  if (raw === null) { return ""; }

  try {

    const dataObject: ObjC.Object | any = new ObjC.Object(raw);

    switch (dataObject.$className) {
      case "__NSCFData":

        try {
          const unarchivedData: string = unArchiveDataAndGetString(dataObject);
          if (unarchivedData.length > 0) {
            return unarchivedData;
          }
        } catch (e) { }

        try {
          const data: string = dataObject.readUtf8String(dataObject.length());
          if (data.length > 0) {
            return data;
          }
        } catch (e) { }
        break;
      case "__NSCFNumber":
        return dataObject.integerValue();
      case "NSTaggedPointerString":
      case "__NSDate":
      case "__NSCFString":
      case "__NSTaggedDate":
        return dataObject.toString();

      default:
        return `(could not get string for class: ${dataObject.$className})`;
    }

  } catch (e) {
    return "(failed to decode)";
  }
}

function decodeAcl(entry){
  const acl = new ObjC.Object(SecAccessControlGetConstraints(entry));

  // Ensure we were able to get the SecAccessControlRef
  if (acl.handle.isNull()) { return "None"; }

  const flags: string[] = [];
  const aclEnum = acl.keyEnumerator();
  let aclItemkey: any;

  while ((aclItemkey = aclEnum.nextObject()) !== null) {
    const aclItem = acl.objectForKey_(aclItemkey);

    switch (smartDataToString(aclItemkey)) {

      // Defaults?
      case "dacl":
        break;

      case "osgn":
        flags.push("kSecAttrKeyClassPrivate");
        break;

      case "od":
        const constraints = aclItem;
        const constraintEnum = constraints.keyEnumerator();
        let constraintItemKey;

        // tslint:disable-next-line:no-conditional-assignment
        while ((constraintItemKey = constraintEnum.nextObject()) !== null) {

          switch (smartDataToString(constraintItemKey)) {
            case "cpo":
              flags.push("kSecAccessControlUserPresence");
              break;

            case "cup":
              flags.push("kSecAccessControlDevicePasscode");
              break;

            case "pkofn":
              constraints.objectForKey_("pkofn") === 1 ?
                flags.push("Or") :
                flags.push("And");
              break;

            case "cbio":
              constraints.objectForKey_("cbio").count() === 1 ?
                flags.push("kSecAccessControlBiometryAny") :
                flags.push("kSecAccessControlBiometryCurrentSet");
              break;

            default:
              break;
          }
        }

        break;

      case "prp":
        flags.push("kSecAccessControlApplicationPassword");
        break;

      default:
        break;
    }
  }

  return flags.join(" ");
}


function dumpKeychain(){
    if (ObjC.available){
        const kCFBooleanTrue = ObjC.classes.__NSCFBoolean.numberWithBool_(true);
        const searchDictionary = ObjC.classes.NSMutableDictionary.alloc().init();
        searchDictionary.setObject_forKey_(kCFBooleanTrue, kSec.kSecReturnAttributes);
        searchDictionary.setObject_forKey_(kCFBooleanTrue, kSec.kSecReturnData);
        searchDictionary.setObject_forKey_(kCFBooleanTrue, kSec.kSecReturnRef);
        searchDictionary.setObject_forKey_(kSec.kSecMatchLimitAll, kSec.kSecMatchLimit);
        searchDictionary.setObject_forKey_(kSec.kSecAttrSynchronizableAny, kSec.kSecAttrSynchronizable);

        const itemClassResults = itemClasses.map((clazz) => {
            const data = [];
            searchDictionary.setObject_forKey_(clazz, kSec.kSecClass);
            const resultsPointer: NativePointer = Memory.alloc(Process.pointerSize);
            const copyResult: NativePointer = SecItemCopyMatching(searchDictionary, resultsPointer);
            if (!copyResult.isNull()) { return data; }
            const searchResults = new ObjC.Object(resultsPointer.readPointer());
            let len = searchResults.count();
            if (len <= 0) { return data; }
            for (let i: number = 0; i < len; i++) {
                data.push({
                    clazz: clazz,
                    data: searchResults.objectAtIndex_(i)//.toString(),
                });
            }
            return data;
        });

        let res = [].concat(...itemClassResults).filter((n) => n !== undefined);
        return res.map((item) => {
            const { data, clazz } = item;
            //console.log(data);
            return {
                access_control: (data.containsKey_(kSec.kSecAttrAccessControl)) ? decodeAcl(data.objectForKey_(kSec.kSecAttrAccessControl)) : "",
                accessible_attribute: reverseEnumLookup(kSec, bytesToUTF8(data.objectForKey_(kSec.kSecAttrAccessible))),
                account: bytesToUTF8(data.objectForKey_(kSec.kSecAttrAccount)),
                alias: bytesToUTF8(data.objectForKey_(kSec.kSecAttrAlias)),
                comment: bytesToUTF8(data.objectForKey_(kSec.kSecAttrComment)),
                create_date: bytesToUTF8(data.objectForKey_(kSec.kSecAttrCreationDate)),
                creator: bytesToUTF8(data.objectForKey_(kSec.kSecAttrCreator)),
                custom_icon: bytesToUTF8(data.objectForKey_(kSec.kSecAttrHasCustomIcon)),
                data: bytesToB64NSString(data.objectForKey_(kSec.kSecValueData)).toString(),
                description: bytesToUTF8(data.objectForKey_(kSec.kSecAttrDescription)),
                entitlement_group: bytesToUTF8(data.objectForKey_(kSec.kSecAttrAccessGroup)),
                generic: bytesToUTF8(data.objectForKey_(kSec.kSecAttrGeneric)),
                invisible: bytesToUTF8(data.objectForKey_(kSec.kSecAttrIsInvisible)),
                item_class: reverseEnumLookup(kSec, clazz),
                label: bytesToUTF8(data.objectForKey_(kSec.kSecAttrLabel)),
                modification_date: bytesToUTF8(data.objectForKey_(kSec.kSecAttrModificationDate)),
                negative: bytesToUTF8(data.objectForKey_(kSec.kSecAttrIsNegative)),
                protected: bytesToUTF8(data.objectForKey_(kSec.kSecProtectedDataItemAttr)),
                script_code: bytesToUTF8(data.objectForKey_(kSec.kSecAttrScriptCode)),
                service: bytesToUTF8(data.objectForKey_(kSec.kSecAttrService)),
                type: bytesToUTF8(data.objectForKey_(kSec.kSecAttrType)),
                persistref: bytesToUTF8(data.objectForKey_(kSec.kSecAttrPersistentReference)),
                };
        });
    }
    else{
        return "";
    }
}



