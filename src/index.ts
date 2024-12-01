import { hook, unhook } from "./ios/hooking/hooking"
import modules from './ios/index'


const exported = new Map()

export function register(func: Function, name?: string) {
  const key = name || func.name
  if (exported.has(key))
    throw new Error(`Name collinsion: ${key}`)

  exported.set(key, func)
}

function registerModules() {
  for (const [name, submodule] of Object.entries(modules)) {
    for (const [method, func] of Object.entries(submodule as {[key: string]: Function})) {
      if (method === 'default')
        register(func, name)
      else
        register(func, [name, func.name].join('/'))
    }
  }
}

export function invoke(name: string, args=[]) {
  const method = exported.get(name)
  if (!method)
    throw new Error(`method "${name}" not found`)

  const { NSAutoreleasePool } = ObjC.classes
  const pool = NSAutoreleasePool.alloc().init()
  try {
    return method(...args)
  } finally {
    pool.release()
  }
}

rpc.exports = {
    invoke,
	hook: (modules: string[], customModules: string[]): boolean => hook(modules, customModules),
	unhook: (): void => unhook(),
};


setImmediate(registerModules)