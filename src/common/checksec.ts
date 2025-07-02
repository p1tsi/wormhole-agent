import { dictFromBytes } from "./lib/helpers.js";
import { encryptionInfo, pie } from "./lib/macho.js";
import { libSystemKernel, csops } from "./lib/libraries/libsystem_kernel.js";

export default function checksec() {
  const main = Process.mainModule;

  // PIE
  const ispie = pie(main);

  //CANARY + ARC
  let canary = false;
  let arc = false;
  try {
    const imports = new Set(main.enumerateImports().map((i) => i.name));
    canary = imports.has("__stack_chk_guard");
    arc = imports.has("objc_release");
  } catch (e) {
    console.log("ERROR ENUMERATING IMPORTS");
  }

  // TODO
  //const encInfo = encryptionInfo(main)

  const result = {
    pie: ispie,
    canary: canary,
    arc: arc,
    entitlements: {},
    encrypted: true,
  };

  // ENTITLEMENTS
  const CS_OPS_ENTITLEMENTS_BLOB = 7;
  const csops_f = new SystemFunction(
    Process.getModuleByName(libSystemKernel).getExportByName(csops)!,
    "int",
    ["int", "int", "pointer", "ulong"],
  );

  // todo: determine CPU endianness
  const ntohl = (val: number) =>
    ((val & 0xff) << 24) |
    ((val & 0xff00) << 8) |
    ((val >> 8) & 0xff00) |
    ((val >> 24) & 0xff);

  // struct csheader {
  //   uint32_t magic;
  //   uint32_t length;
  // };

  const SIZE_OF_CSHEADER = 8;
  //const ERANGE = 34
  const csheader = Memory.alloc(SIZE_OF_CSHEADER);
  const { value } = csops_f(
    Process.id,
    CS_OPS_ENTITLEMENTS_BLOB,
    csheader,
    SIZE_OF_CSHEADER,
  );
  if (value === -1) {
    const length = ntohl(csheader.add(4).readU32());
    const content = Memory.alloc(length);
    if (
      csops_f(Process.id, CS_OPS_ENTITLEMENTS_BLOB, content, length).value === 0
    ) {
      result.entitlements = dictFromBytes(
        content.add(SIZE_OF_CSHEADER),
        length - SIZE_OF_CSHEADER,
      );
    }
  }

  return result;
}
