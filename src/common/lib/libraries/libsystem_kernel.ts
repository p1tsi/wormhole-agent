export const libSystemKernel = "libsystem_kernel.dylib";

export const csops = "csops";

// open
export const open = "open";
export const open_ptr = Process.getModuleByName(libSystemKernel).getExportByName("open");
export const open_f = new NativeFunction(
  open_ptr!,
  "int",
  ["pointer", "int", "int"],
);

// read
export const read = "read";
export const read_ptr = Process.getModuleByName(libSystemKernel).getExportByName("read");
export const read_f = new NativeFunction(
  read_ptr!,
  "int",
  ["int", "pointer", "int"],
);

// write
export const write = "write";
export const write_ptr = Process.getModuleByName(libSystemKernel).getExportByName("write");
export const write_f = new NativeFunction(
  write_ptr!,
  "int",
  ["int", "pointer", "int"],
);

// close
export const close = "close";
export const close_ptr = Process.getModuleByName(libSystemKernel).getExportByName("close");
export const close_f = new NativeFunction(
  close_ptr!,
  "int",
  ["int"],
);


// unlink
export const unlink = "unlink";
export const unlink_ptr = Process.getModuleByName(libSystemKernel).getExportByName("unlink");
export const unlink_f = new NativeFunction(
  unlink_ptr!,
  "int",
  ["pointer"],
);


// lseek
export const lseek = "lseek";
export const lseek_ptr = Process.getModuleByName(libSystemKernel).getExportByName("lseek");
export const lseek_f = new NativeFunction(
  lseek_ptr!,
  "int64",
  ["int", "int64", "int"],
);


// fstat
export const fstat = "fstat";
export const fstat_ptr = Process.getModuleByName(libSystemKernel).getExportByName("fstat");
export const fstat_f = new NativeFunction(
  fstat_ptr!,
  "int",
  ["int", "pointer"],
);

// getpid
export const getpid = "getpid";
export const getpid_ptr = Process.getModuleByName(libSystemKernel).getExportByName("getpid");
export const getpid_f = new NativeFunction(
  getpid_ptr!,
  "int",
  [],
);

// kill
export const kill = "kill";
export const kill_ptr = Process.getModuleByName(libSystemKernel).getExportByName("kill");
export const kill_f = new NativeFunction(
  kill_ptr!,
  "int",
  ["int", "int"],
);

// mmap
export const mmap = "mmap";
export const mmap_ptr = Process.getModuleByName(libSystemKernel).getExportByName("mmap");
export const mmap_f = new NativeFunction(
  mmap_ptr!,
  "pointer",
  ["pointer", "uint", "int", "int", "int", "long"],
);


// munmap
export const munmap = "munmap";
export const munmap_ptr = Process.getModuleByName(libSystemKernel).getExportByName("munmap");
export const munmap_f = new NativeFunction(
  munmap_ptr!,
  "int",
  ["pointer", "uint"],
);


// pipe
export const pipe = "pipe";
export const pipe_ptr = Process.getModuleByName(libSystemKernel).getExportByName("pipe");
export const pipe_f = new NativeFunction(
  pipe_ptr!,
  "int",
  ["pointer"],
);


// dup2
export const dup2 = "dup2";
export const dup2_ptr = Process.getModuleByName(libSystemKernel).getExportByName("dup2");
export const dup2_f = new NativeFunction(
  dup2_ptr!,
  "int",
  ["int", "int"],
);


// fcntl
export const fcntl = "fcntl";
export const fcntl_ptr = Process.getModuleByName(libSystemKernel).getExportByName("fcntl");
export const fcntl_f = new NativeFunction(
  fcntl_ptr!,
  "int",
  ["int", "int", "int"],
);

// access
export const access = "access";
export const access_ptr = Process.getModuleByName(libSystemKernel).getExportByName("access");
export const access_f = new NativeFunction(
  access_ptr!,
  "int",
  ["pointer", "int"],
);

export const proc_pidinfo = "proc_pidinfo";
export const proc_pidfdinfo = "proc_pidfdinfo";
