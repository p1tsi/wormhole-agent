import { dictFromBytes } from './lib/helpers'
import { encryptionInfo, pie } from './lib/macho'


export default function checksec() {
  const [main] = Process.enumerateModules()

  // PIE
  const ispie = pie(main)

  //CANARY + ARC
  let canary = false
  let arc = false
  try{
    const imports = new Set(main.enumerateImports().map(i => i.name))
    canary = imports.has('__stack_chk_guard')
    arc = imports.has('objc_release')
  }
  catch (e){
    console.log("ERROR ENUMERATING IMPORTS");
  }

  /*console.log(encryptionInfo(main).ptr)
  console.log(encryptionInfo(main).offset)
  console.log(encryptionInfo(main).size)
  console.log(encryptionInfo(main).offsetOfCmd)
  console.log(encryptionInfo(main).sizeOfCmd)*/

  const result = {
    pie: ispie,
    canary: canary,
    arc: arc,
    entitlements: {},
    encrypted: false
  }

  // ENTITLEMENTS
  const CS_OPS_ENTITLEMENTS_BLOB = 7
  const csops = new SystemFunction(
    Module.findExportByName('libsystem_kernel.dylib', 'csops')!,
    'int',
    ['int', 'int', 'pointer', 'ulong']
  )

  // todo: determine CPU endianness
  const ntohl = (val: number) => ((val & 0xFF) << 24)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF);

  // struct csheader {
  //   uint32_t magic;
  //   uint32_t length;
  // };

  const SIZE_OF_CSHEADER = 8
  const ERANGE = 34
  const csheader = Memory.alloc(SIZE_OF_CSHEADER)
  const { value } = csops(Process.id, CS_OPS_ENTITLEMENTS_BLOB, csheader, SIZE_OF_CSHEADER)
  if (value === -1 ) {
    const length = ntohl(csheader.add(4).readU32())
    const content = Memory.alloc(length)
    if (csops(Process.id, CS_OPS_ENTITLEMENTS_BLOB, content, length).value === 0) {
      result.entitlements = dictFromBytes(
        content.add(SIZE_OF_CSHEADER), length - SIZE_OF_CSHEADER
      )
    }
  }

  return result
}
