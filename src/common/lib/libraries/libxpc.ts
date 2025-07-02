export const libXPCDylib = "libxpc.dylib";

export const xpc_connection_send_message = "xpc_connection_send_message";
export const xpc_connection_send_message_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_send_message");
export const xpc_connection_send_message_f = new NativeFunction(
  xpc_connection_send_message_ptr!,
  "void",
  ["pointer", "pointer"],
);


// xpc_copy_description
export const xpc_copy_description = "xpc_copy_description";
export const xpc_copy_description_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_copy_description");
export const xpc_copy_description_f = new NativeFunction(xpc_copy_description_ptr!, "pointer", ["pointer"]);

// CONNECTION FUNCTIONS
export const xpc_connection_get_name = "xpc_connection_get_name";
export const xpc_connection_get_name_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_get_name");
export const xpc_connection_get_name_f = new NativeFunction(xpc_connection_get_name_ptr!, "pointer", ["pointer"]);

export const xpc_connection_get_pid = "xpc_connection_get_pid";
export const xpc_connection_get_pid_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_get_pid");
export const xpc_connection_get_pid_f = new NativeFunction(xpc_connection_get_pid_ptr!, "pointer", ["pointer"]);

export const xpc_connection_get_euid = "xpc_connection_get_euid";
export const xpc_connection_get_euid_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_get_euid");
export const xpc_connection_get_euid_f = new NativeFunction(xpc_connection_get_euid_ptr!, "pointer", ["pointer"]);

export const xpc_connection_get_egid = "xpc_connection_get_egid";
export const xpc_connection_get_egid_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_get_egid");
export const xpc_connection_get_egid_f = new NativeFunction(xpc_connection_get_egid_ptr!, "pointer", ["pointer"]);

export const xpc_connection_get_asid = "xpc_connection_get_asid";
export const xpc_connection_get_asid_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_get_asid");
export const xpc_connection_get_asid_f = new NativeFunction(xpc_connection_get_asid_ptr!, "pointer", ["pointer"]);

export const xpc_connection_get_context = "xpc_connection_get_context";
export const xpc_connection_get_context_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_connection_get_context");
export const xpc_connection_get_context_f = new NativeFunction(xpc_connection_get_context_ptr!, "pointer", ["pointer"]);

// DICTIONARY + TYPE FUNCTIONS
export const xpc_dictionary_get_count = "xpc_dictionary_get_count";
export const xpc_dictionary_get_count_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_dictionary_get_count");
export const xpc_dictionary_get_count_f = new NativeFunction(xpc_dictionary_get_count_ptr!, "size_t", ["pointer"]);

export const xpc_dictionary_get_value = "xpc_dictionary_get_value";
export const xpc_dictionary_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_dictionary_get_value");
export const xpc_dictionary_get_value_f = new NativeFunction(xpc_dictionary_get_value_ptr!, "pointer", ["pointer", "pointer"]);

export const xpc_dictionary_apply = "xpc_dictionary_apply";
export const xpc_dictionary_apply_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_dictionary_apply");
export const xpc_dictionary_apply_f = new NativeFunction(xpc_dictionary_apply_ptr!, "pointer", ["pointer", "pointer"]);

export const xpc_get_type = "xpc_get_type";
export const xpc_get_type_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_get_type");
export const xpc_get_type_f = new NativeFunction(xpc_get_type_ptr!, "pointer", ["pointer"]);

export const xpc_type_get_name = "xpc_type_get_name";
export const xpc_type_get_name_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_type_get_name");
export const xpc_type_get_name_f = new NativeFunction(xpc_type_get_name_ptr!, "pointer", ["pointer"]);

// VALUE GETTERS
export const xpc_bool_get_value = "xpc_bool_get_value";
export const xpc_bool_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_bool_get_value");
export const xpc_bool_get_value_f = new NativeFunction(xpc_bool_get_value_ptr!, "bool", ["pointer"]);

export const xpc_int64_get_value = "xpc_int64_get_value";
export const xpc_int64_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_int64_get_value");
export const xpc_int64_get_value_f = new NativeFunction(xpc_int64_get_value_ptr!, "int64", ["pointer"]);

export const xpc_uint64_get_value = "xpc_uint64_get_value";
export const xpc_uint64_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_uint64_get_value");
export const xpc_uint64_get_value_f = new NativeFunction(xpc_uint64_get_value_ptr!, "uint64", ["pointer"]);

export const xpc_double_get_value = "xpc_double_get_value";
export const xpc_double_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_double_get_value");
export const xpc_double_get_value_f = new NativeFunction(xpc_double_get_value_ptr!, "double", ["pointer"]);

export const xpc_string_get_string_ptr = "xpc_string_get_string_ptr";
export const xpc_string_get_string_ptr_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_string_get_string_ptr");
export const xpc_string_get_string_ptr_f = new NativeFunction(xpc_string_get_string_ptr_ptr!, "pointer", ["pointer"]);

export const xpc_data_get_length = "xpc_data_get_length";
export const xpc_data_get_length_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_data_get_length");
export const xpc_data_get_length_f = new NativeFunction(xpc_data_get_length_ptr!, "int32", ["pointer"]);

export const xpc_data_get_bytes_ptr = "xpc_data_get_bytes_ptr";
export const xpc_data_get_bytes_ptr_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_data_get_bytes_ptr");
export const xpc_data_get_bytes_ptr_f = new NativeFunction(xpc_data_get_bytes_ptr_ptr!, "pointer", ["pointer"]);

export const xpc_dictionary_get_dictionary = "xpc_dictionary_get_dictionary";
export const xpc_dictionary_get_dictionary_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_dictionary_get_dictionary");
export const xpc_dictionary_get_dictionary_f = new NativeFunction(xpc_dictionary_get_dictionary_ptr!, "pointer", ["pointer"]);

export const xpc_array_get_count = "xpc_array_get_count";
export const xpc_array_get_count_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_array_get_count");
export const xpc_array_get_count_f = new NativeFunction(xpc_array_get_count_ptr!, "int32", ["pointer"]);

export const xpc_array_get_value = "xpc_array_get_value";
export const xpc_array_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_array_get_value");
export const xpc_array_get_value_f = new NativeFunction(xpc_array_get_value_ptr!, "pointer", ["pointer", "int32"]);

export const xpc_date_get_value = "xpc_date_get_value";
export const xpc_date_get_value_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_date_get_value");
export const xpc_date_get_value_f = new NativeFunction(xpc_date_get_value_ptr!, "int64", ["pointer"]);

export const xpc_uuid_get_bytes = "xpc_uuid_get_bytes";
export const xpc_uuid_get_bytes_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_uuid_get_bytes");
export const xpc_uuid_get_bytes_f = new NativeFunction(xpc_uuid_get_bytes_ptr!, "pointer", ["pointer"]);

// SHMEM & FD
export const xpc_shmem_map = "xpc_shmem_map";
export const xpc_shmem_map_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_shmem_map");
export const xpc_shmem_map_f = new NativeFunction(xpc_shmem_map_ptr!, "size_t", ["pointer", "pointer"]);

export const xpc_fd_dup = "xpc_fd_dup";
export const xpc_fd_dup_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_fd_dup");
export const xpc_fd_dup_f = new NativeFunction(xpc_fd_dup_ptr!, "int", ["pointer"]);

export const xpc_endpoint_copy_listener_port_4sim = "xpc_endpoint_copy_listener_port_4sim";
export const xpc_endpoint_copy_listener_port_4sim_ptr = Process.getModuleByName(libXPCDylib).getSymbolByName("xpc_endpoint_copy_listener_port_4sim");
export const xpc_endpoint_copy_listener_port_4sim_f = new NativeFunction(xpc_endpoint_copy_listener_port_4sim_ptr!, "int", ["pointer"]);
