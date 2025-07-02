
export const CFStringGetLength = new NativeFunction(Process.getModuleByName('CoreFoundation').getExportByName('CFStringGetLength'), 'long', ['pointer']);
export const CFRelease = new NativeFunction(Process.getModuleByName('CoreFoundation').getExportByName('CFRelease'), 'void', ['pointer']);
export const CFStringGetCStringPtr = new NativeFunction(Process.getModuleByName('CoreFoundation').getExportByName('CFStringGetCStringPtr'), 'pointer', ['pointer', 'uint32']);
export const CFGetTypeID = new NativeFunction(Process.getModuleByName('CoreFoundation').getExportByName('CFGetTypeID'), 'pointer', ['pointer']);
export const CFBooleanGetTypeID = new NativeFunction(Process.getModuleByName('CoreFoundation').getExportByName('CFBooleanGetTypeID'), 'pointer', []);

