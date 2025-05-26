export type Schema = [any, any]
export function api(library: string, schema){
  const result = {}
  for (const [name, args] of Object.entries(schema)) {
    const [retType, argTypes] = args as Schema
    const p = Module.findExportByName(library, name)
    if (!p) throw new Error(`unable to resolve symbol: ${library}!${name}`)
    result[name] = new NativeFunction(p, retType, argTypes)
  }
  return result
}
