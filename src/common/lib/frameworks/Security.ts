
const SecurityFramework = 'Security'

export const SecItemCopyMatching = new NativeFunction(Process.getModuleByName(SecurityFramework).getExportByName('SecItemCopyMatching'), 'pointer', ['pointer', 'pointer']);
export const SecItemDelete = new NativeFunction(Process.getModuleByName(SecurityFramework).getExportByName('SecItemDelete'), 'pointer', ['pointer']);
export const SecAccessControlGetConstraints = new NativeFunction(Process.getModuleByName(SecurityFramework).getExportByName('SecAccessControlGetConstraints'), 'pointer', ['pointer']);
export const SecAccessControlGetRequirePassword = new NativeFunction(Process.getModuleByName(SecurityFramework).getExportByName('SecAccessControlGetRequirePassword'), 'bool', ['pointer']);
