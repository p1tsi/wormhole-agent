export const libSystemC = "libsystem_c.dylib";

export const snprintf = "snprintf";
export const inet_ntop = "inet_ntop";

export const remove_f = new NativeFunction(
  Process.getModuleByName(libSystemC).getExportByName("remove")!,
  "int",
  ["pointer"],
);
