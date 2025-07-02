import { hook, unhook } from './common/hooking/hooking.js';
import common_modules from './common/index.js'
import ObjC from 'frida-objc-bridge';

const exported = new Map();

function register(func: Function, name?: string) {
  const key = name || func.name;
  if (exported.has(key)) {
    throw new Error(`Name collision: ${key}`);
  }
  exported.set(key, func);
}

function registerModules() {  
  for (const [name, submodule] of Object.entries(common_modules)) {
    for (const [method, func] of Object.entries(submodule as { [key: string]: Function })) {
      if (method === 'default') {
        register(func, name);
      } else {
        register(func, [name, func.name].join('/'));
      }
    }
  }
}

function invoke(name: string, args = []) {
  const method = exported.get(name);
  if (!method) {
    throw new Error(`method "${name}" not found`);
  }

  const { NSAutoreleasePool } = ObjC.classes;
  const pool = NSAutoreleasePool.alloc().init();
  try {
    return method(...args);
  } finally {
    pool.release();
  }
}

// Frida exposes methods via `rpc.exports` (not `export`)
rpc.exports = {
  invoke,
  hook: (modules: string[], customModules: string[]): boolean => hook(modules, customModules),
  unhook: (): void => unhook(),
};

setImmediate(registerModules);
