export const libDyld = "libdyld.dylib";

export const dlopen_f = new NativeFunction(
  Process.getModuleByName(libDyld).getExportByName("dlopen")!,
  "pointer",
  ["pointer", "int"],
);
