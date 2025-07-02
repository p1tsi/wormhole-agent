import ObjC from "frida-objc-bridge";
import {
  lseek_f,
  read_f,
  write_f,
  close_f,
  access_f,
  open_f,
} from "../common/lib/libraries/libsystem_kernel.js";
import { remove_f } from "../common/lib/libraries/libsystem_c.js";
import { dlopen_f } from "../common/lib/libraries/libdyld.js";

const O_RDONLY = 0;
const O_WRONLY = 1;
const O_RDWR = 2;
const O_CREAT = 512;

const SEEK_SET = 0;
const SEEK_CUR = 1;
const SEEK_END = 2;


var FAT_MAGIC = 0xcafebabe;
var FAT_CIGAM = 0xbebafeca;
var MH_MAGIC = 0xfeedface;
var MH_CIGAM = 0xcefaedfe;
var MH_MAGIC_64 = 0xfeedfacf;
var MH_CIGAM_64 = 0xcffaedfe;
var LC_SEGMENT = 0x1;
var LC_SEGMENT_64 = 0x19;
var LC_ENCRYPTION_INFO = 0x21;
var LC_ENCRYPTION_INFO_64 = 0x2C;


function getU32(addr) {
    if (typeof addr == "number") {
        addr = ptr(addr);
    }
    return addr.readU32();
}

function putU64(addr, n) {
    if (typeof addr == "number") {
        addr = ptr(addr);
    }
    return addr.writeU64(n);
}

function allocStr(str: string): NativePointer {
  return Memory.allocUtf8String(str);
}

function ptrify(addr: number | NativePointer): NativePointer {
  return typeof addr === "number" ? ptr(addr) : addr;
}

function putStr(addr: number | NativePointer, str: string): NativePointer {
  const p = ptrify(addr);
  return p.writeUtf8String(str);
}

function getByteArr(addr: number | NativePointer, len: number): ArrayBuffer {
  return ptrify(addr).readByteArray(len) as ArrayBuffer;
}

// ...similar for getU8, putU8, getU16, putU16, getU32, putU32, getU64, putU64, getPt, putPt

function malloc(size: number): NativePointer {
  return Memory.alloc(size);
}

const NSSearchPathForDirectoriesInDomains = new NativeFunction(
  Process.getModuleByName("Foundation")!.getExportByName("NSSearchPathForDirectoriesInDomains")!,
  "pointer",
  ["int", "int", "int"]
);

function getDocumentDir(): string {
  const NSDocumentDirectory = 9;
  const NSUserDomainMask = 1;
  const npdirs = NSSearchPathForDirectoriesInDomains(
    NSDocumentDirectory,
    NSUserDomainMask,
    1
  );
  return new ObjC.Object(npdirs).objectAtIndex_(0).toString();
}

function open(pathname: string | NativePointer, flags: number, mode: number): number {
  const p = typeof pathname === "string" ? allocStr(pathname) : pathname;
  return open_f(p, flags, mode);
}

interface ModuleInfo {
  path: string;
  base: NativePointer;
  size: number;
  name: string;
}

let modules: ModuleInfo[] = [];

function getAllAppModules(): ModuleInfo[] {
  modules = Process.enumerateModules().filter((m) => m.path.includes(".app"));
  return modules;
}

// Load magic & constants...

function pad(str: string, n: number): string {
  return "0".repeat(n - str.length) + str;
}

function swap32(value: number): number {
  const hex = pad(value.toString(16), 8);
  let out = "";
  for (let i = 0; i < hex.length; i += 2) {
    out = hex.substr(hex.length - i - 2, 2) + out;
  }
  return parseInt(out, 16);
}

function dumpModule(name: string): string | void {
  if (modules.length === 0) modules = getAllAppModules();
  const target = modules.find((m) => m.path.includes(name));
  if (!target) {
    console.log("Cannot find module");
    return;
  }

  var modbase = target.base;
  var modsize = target.size;
  var newmodname = target.name;
  var oldmodpath = target.path;

  const newmodpath = `${getDocumentDir()}/${target.name}.dec`;
  if (access_f(allocStr(newmodpath), 0) === 0) {
    remove_f(allocStr(newmodpath));
  }

  const fmodule = open(newmodpath, O_CREAT | O_RDWR, 0);
  const foldmodule = open(oldmodpath, O_RDONLY, 0);
  if (fmodule === -1 || foldmodule === -1) {
    console.log("Cannot open file", newmodpath);
    return;
  }

  var is64bit = false;
  var size_of_mach_header = 0;
  var magic = getU32(modbase);
  var cur_cpu_type = getU32(modbase.add(4));
  var cur_cpu_subtype = getU32(modbase.add(8));
  if (magic == MH_MAGIC || magic == MH_CIGAM) {
      //is64bit = false;
      size_of_mach_header = 28;
  }else if (magic == MH_MAGIC_64 || magic == MH_CIGAM_64) {
      is64bit = true;
      size_of_mach_header = 32;
  }

  var BUFSIZE = 4096;
  var buffer = malloc(BUFSIZE);

  read_f(foldmodule, buffer, BUFSIZE);

  var fileoffset = 0;
  var filesize = 0;
  magic = getU32(buffer);
  if (magic == FAT_CIGAM || magic == FAT_MAGIC){
      var off = 4;
      var archs = swap32(getU32(buffer.add(off)));
      for (var i = 0; i < archs; i++) {
          var cputype = swap32(getU32(buffer.add(off + 4)));
          var cpusubtype = swap32(getU32(buffer.add(off + 8)));
          if(cur_cpu_type == cputype && cur_cpu_subtype == cpusubtype){
              fileoffset = swap32(getU32(buffer.add(off + 12)));
              filesize = swap32(getU32(buffer.add(off + 16)));
              break;
          }
          off += 20;
      }

      if(fileoffset == 0 || filesize == 0)
          return;

      lseek_f(fmodule, 0, SEEK_SET);
      lseek_f(foldmodule, fileoffset, SEEK_SET);
      for(var i = 0; i < filesize / BUFSIZE; i++) { //parseInt(
          read_f(foldmodule, buffer, BUFSIZE);
          write_f(fmodule, buffer, BUFSIZE);
      }
      if(filesize % BUFSIZE){
          read_f(foldmodule, buffer, filesize % BUFSIZE);
          write_f(fmodule, buffer, filesize % BUFSIZE);
      }
  }else{
      var readLen = 0;
      lseek_f(foldmodule, 0, SEEK_SET);
      lseek_f(fmodule, 0, SEEK_SET);
      while(readLen = read_f(foldmodule, buffer, BUFSIZE)) {
          write_f(fmodule, buffer, readLen);
      }
  }

  var ncmds = getU32(modbase.add(16));
  var off = size_of_mach_header;
  var offset_cryptid = -1;
  var crypt_off = 0;
  var crypt_size = 0;
  var segments = [];

  //TODO: Bug in crypto stuff (offset)
  for (var i = 0; i < ncmds; i++) {
      var cmd = getU32(modbase.add(off));
      var cmdsize = getU32(modbase.add(off + 4));
      if (cmd == LC_ENCRYPTION_INFO || cmd == LC_ENCRYPTION_INFO_64) {
          offset_cryptid = off + 16;
          crypt_off = getU32(modbase.add(off + 8));
          crypt_size = getU32(modbase.add(off + 12));
      }
      off += cmdsize;
  }

  if (offset_cryptid != -1) {
      var tpbuf = malloc(8);
      putU64(tpbuf, 0);
      lseek_f(fmodule, offset_cryptid, SEEK_SET);
      write_f(fmodule, tpbuf, 4);
      lseek_f(fmodule, crypt_off, SEEK_SET);
      write_f(fmodule, modbase.add(crypt_off), crypt_size);
  }

  close_f(fmodule);
  close_f(foldmodule);
  return newmodpath;
}

function loadAllDynamicLibrary(appPath: string): void {
  const defaultManager = ObjC.classes.NSFileManager.defaultManager();
  const errPtr = Memory.alloc(Process.pointerSize);
  errPtr.writePointer(NULL);
  const filenames = defaultManager.contentsOfDirectoryAtPath_error_(
    allocStr(appPath),
    errPtr
  ) as ObjC.Object;

  for (let i = 0; i < filenames.count(); i++) {
    const file = filenames.objectAtIndex_(i).toString();
    if (file.startsWith("libswift")) continue;

    const filePath = ObjC.classes.NSString
      .stringWithString_(file)
      .stringByAppendingPathComponent_(appPath)
      .toString();

    if (file.endsWith(".framework")) {
      const bundle = ObjC.classes.NSBundle.bundleWithPath_(allocStr(filePath));
      bundle.isLoaded() ? null : bundle.load();
    } else if (file.endsWith(".dylib")) {
      const loaded = modules.some((m) => m.path.includes(file));
      if (!loaded) {
        dlopen_f(allocStr(filePath), 9);
      }
    }
  }
}

export interface Ipa {
  path: string;
  is_dir: boolean;
}

export default function dumpipa(): Ipa[] {
  const ipa: Ipa = {
    path: ObjC.classes.NSBundle.mainBundle().bundlePath().toString(),
    is_dir: true,
  };

  const exePath = ObjC.classes.NSBundle.mainBundle()
    .executablePath()
    .toString();
  const result = dumpModule(exePath) as string;

  const mainExecutable: Ipa = {
    path: result,
    is_dir: false,
  };

  return [ipa, mainExecutable];
}
