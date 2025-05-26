    export const objc_copyClassNamesForImage = new NativeFunction(
            Module.findExportByName(null, 'objc_copyClassNamesForImage'),
            'pointer',
            ['pointer', 'pointer']
);

export const free = new NativeFunction(
    Module.findExportByName(null, 'free'),
    'void',
    ['pointer']
);