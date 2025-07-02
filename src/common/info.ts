import ObjC from "frida-objc-bridge";

import { valueOf } from './lib/helpers.js'
import { NSTemporaryDirectory, NSHomeDirectory } from './lib/foundation.js'

type Info = { [key: string]: any }

export function icon(): ArrayBuffer {
  const { NSBundle, UIImage } = ObjC.classes
  const UIImagePNGRepresentation = new NativeFunction(
    Process.getModuleByName("UIKit").getExportByName('UIImagePNGRepresentation')!,
    'pointer',
    ['pointer']
  )

  const fail = new ArrayBuffer(0)
  const dict = NSBundle.mainBundle().infoDictionary()
  const icons = dict.objectForKey_('CFBundleIcons')
  if (!icons) return fail
  const primary = icons.objectForKey_('CFBundlePrimaryIcon')
  if (!primary) return fail
  const files = primary.objectForKey_('CFBundleIconFiles')
  if (!files) return fail
  const name = files.lastObject()
  if (!name) return fail
  const img = UIImage.imageNamed_(name)
  if (!img) return fail
  const data = UIImagePNGRepresentation(img) as NativePointer
  if (data.isNull()) return fail
  const nsdata = new ObjC.Object(data)
  return ptr(nsdata.bytes()).readByteArray(nsdata.length())!
}

export function info(): Info {
  const mainBundle = ObjC.classes.NSBundle.mainBundle()
  const json = valueOf(mainBundle.infoDictionary())
  const result: Info = {
    tmp: NSTemporaryDirectory(),
    home: NSHomeDirectory(),
    json,
  }

  const BUNDLE_ATTR_MAPPING = {
    id: 'bundleIdentifier',
    bundle: 'bundlePath',
    binary: 'executablePath'
  }

  for (const [key, method] of Object.entries(BUNDLE_ATTR_MAPPING)){
    let r = mainBundle[method]();
    if (r){
        result[key] = r.toString()
    }
  }

  const READABLE_NAME_MAPPING = {
    version: 'CFBundleVersion',
    semVer: 'CFBundleShortVersionString',
    minOS: 'MinimumOSVersion'
  }

  for (const [key, label] of Object.entries(READABLE_NAME_MAPPING))
    result[key] = json[label] || null

  if ('CFBundleDisplayName' in json) {
    result.name = json['CFBundleDisplayName']
  } else if ('CFBundleName' in json) {
    result.name = json['CFBundleName']
  } else if ('CFBundleAlternateNames' in json) {
    result.name = json['CFBundleAlternateNames'][0]
  }
  return result
}


export function userDefaults() {
    return valueOf(ObjC.classes.NSUserDefaults.standardUserDefaults().dictionaryRepresentation())
}

/*export function userDefaultsWithSuiteName(suiteName: string) {
  return valueOf(
    ObjC.classes.NSUserDefaults.alloc().initWithSuiteName_(
        ObjC.classes.NSString.stringWithUTF8String_(
            Memory.allocUtf8String(suiteName)
        )
    ).dictionaryRepresentation()
  )
}*/
