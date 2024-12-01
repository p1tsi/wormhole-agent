import { libXPCDylib } from '../../../lib/libraries'

//TODO: refactor with a function with for loop

export const xpc_copy_description = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_copy_description'), 'pointer', ['pointer']);

// CONNECTION FUNCTIONS
export const xpc_connection_get_name = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_connection_get_name'), 'pointer', ['pointer']);
export const xpc_connection_get_pid = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_connection_get_pid'), 'pointer', ['pointer']);
export const xpc_connection_get_euid = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_connection_get_euid'), 'pointer', ['pointer']);
export const xpc_connection_get_egid = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_connection_get_egid'), 'pointer', ['pointer']);
export const xpc_connection_get_asid = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_connection_get_asid'), 'pointer', ['pointer']);
export const xpc_connection_get_context = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_connection_get_context'), 'pointer', ['pointer']);


export const xpc_dictionary_get_count = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_dictionary_get_count'), 'size_t', ['pointer']);
export const xpc_dictionary_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_dictionary_get_value'), 'pointer', ['pointer', 'pointer']);
export const xpc_dictionary_apply = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_dictionary_apply'), 'pointer', ['pointer', 'pointer']);
export const xpc_get_type = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_get_type'), 'pointer', ['pointer']);
export const xpc_type_get_name = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_type_get_name'), 'pointer', ['pointer']);

export const xpc_bool_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_bool_get_value'), 'bool', ['pointer']);
export const xpc_int64_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_int64_get_value'), 'int64', ['pointer']);
export const xpc_uint64_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_uint64_get_value'), 'uint64', ['pointer']);
export const xpc_double_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_double_get_value'), 'double', ['pointer']);
export const xpc_string_get_string_ptr = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_string_get_string_ptr'), 'pointer', ['pointer']);
export const xpc_data_get_length = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_data_get_length'), 'int32', ['pointer']);
export const xpc_data_get_bytes_ptr = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_data_get_bytes_ptr'), 'pointer', ['pointer']);
export const xpc_dictionary_get_dictionary = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_dictionary_get_dictionary'), 'pointer', ['pointer']);
export const xpc_array_get_count = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_array_get_count'), 'int32', ['pointer']);
export const xpc_array_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_array_get_value'), 'pointer', ['pointer', 'int32']);
export const xpc_date_get_value = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_date_get_value'), 'int64', ['pointer']);

export const xpc_uuid_get_bytes = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_uuid_get_bytes'), 'pointer', ['pointer']);


export const xpc_shmem_map = new NativeFunction(Module.getExportByName(libXPCDylib, 'xpc_shmem_map'), 'size_t', ['pointer', 'pointer']);

export const xpc_fd_dup = new NativeFunction(Module.getExportByName(libXPCDylib, "xpc_fd_dup"), "int", ["pointer"]);

export const xpc_endpoint_copy_listener_port_4sim = new NativeFunction(Module.getExportByName(libXPCDylib, "xpc_endpoint_copy_listener_port_4sim"), "int", ["pointer"]);