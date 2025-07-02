const UIKitFramework = 'UIKit'

const CGFloat = (Process.pointerSize === 4) ? 'float' : 'double'
const CGSize = [CGFloat, CGFloat]

export const UIGraphicsBeginImageContextWithOptions = new NativeFunction(Process.getModuleByName(UIKitFramework).getSymbolByName('UIGraphicsBeginImageContextWithOptions'), 'void', ['pointer', 'bool', 'float']);
export const UIGraphicsGetImageFromCurrentImageContext = new NativeFunction(Process.getModuleByName(UIKitFramework).getSymbolByName('UIGraphicsGetImageFromCurrentImageContext'), 'pointer', []);
export const UIGraphicsEndImageContext = new NativeFunction(Process.getModuleByName(UIKitFramework).getSymbolByName('UIGraphicsEndImageContext'), 'void', []);
export const UIImagePNGRepresentation = new NativeFunction(Process.getModuleByName(UIKitFramework).getSymbolByName('UIImagePNGRepresentation'), 'pointer', ['pointer']);
