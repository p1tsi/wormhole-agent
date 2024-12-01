const UIKitFramework = 'UIKit'

const CGFloat = (Process.pointerSize === 4) ? 'float' : 'double'
const CGSize = [CGFloat, CGFloat]

export const UIGraphicsBeginImageContextWithOptions = new NativeFunction(Module.getExportByName(UIKitFramework, 'UIGraphicsBeginImageContextWithOptions'), 'void', ['pointer', 'bool', 'float']);
export const UIGraphicsGetImageFromCurrentImageContext = new NativeFunction(Module.getExportByName(UIKitFramework, 'UIGraphicsGetImageFromCurrentImageContext'), 'pointer', []);
export const UIGraphicsEndImageContext = new NativeFunction(Module.getExportByName(UIKitFramework, 'UIGraphicsEndImageContext'), 'void', []);
export const UIImagePNGRepresentation = new NativeFunction(Module.getExportByName(UIKitFramework, 'UIImagePNGRepresentation'), 'pointer', ['pointer']);
