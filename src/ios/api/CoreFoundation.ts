
export const CFStringGetLength = new NativeFunction(Module.getExportByName('CoreFoundation', 'CFStringGetLength'), 'long', ['pointer']);
export const CFRelease = new NativeFunction(Module.getExportByName('CoreFoundation', 'CFRelease'), 'void', ['pointer']);
export const CFStringGetCStringPtr = new NativeFunction(Module.getExportByName('CoreFoundation', 'CFStringGetCStringPtr'), 'pointer', ['pointer', 'uint32']);
export const CFGetTypeID = new NativeFunction(Module.getExportByName('CoreFoundation', 'CFGetTypeID'), 'pointer', ['pointer']);
export const CFBooleanGetTypeID = new NativeFunction(Module.getExportByName('CoreFoundation', 'CFBooleanGetTypeID'), 'pointer', []);

