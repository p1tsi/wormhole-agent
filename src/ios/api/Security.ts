
const SecurityFramework = 'Security'

export const SecItemCopyMatching = new NativeFunction(Module.getExportByName(SecurityFramework, 'SecItemCopyMatching'), 'pointer', ['pointer', 'pointer']);
export const SecItemDelete = new NativeFunction(Module.getExportByName(SecurityFramework, 'SecItemDelete'), 'pointer', ['pointer']);
export const SecAccessControlGetConstraints = new NativeFunction(Module.getExportByName(SecurityFramework, 'SecAccessControlGetConstraints'), 'pointer', ['pointer']);
export const SecAccessControlGetRequirePassword = new NativeFunction(Module.getExportByName(SecurityFramework, 'SecAccessControlGetRequirePassword'), 'bool', ['pointer']);
