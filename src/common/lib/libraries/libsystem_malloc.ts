export const libSystemMalloc = "libsystem_malloc.dylib";

export const malloc = "malloc";

export const free = "free";
export const free_f = new NativeFunction(
  Process.getModuleByName(libSystemMalloc).getExportByName(free),
  "void",
  ["pointer"],
);
