import { network_functions } from './modules/network.js';
import { xpc_functions } from './modules/xpc/xpc.js';
import { sqlite_functions } from './modules/sqlite.js';
//import { sqlite_cipher_functions } from './modules/sqlite_cipher';
import { user_defaults_functions } from './modules/userDefaults.js';
import { notifications_functions } from './modules/notifications.js';
import { keychain_functions } from './modules/keychain.js';
import { encryption_functions } from './modules/encryption.js';
import { io_functions } from './modules/io.js';
import { IOKit_functions } from './modules/IOKit.js';
import { icloud_functions } from './modules/icloud.js';
import { gestalt_functions } from './modules/gestalt.js';
import { dyld_functions } from './modules/dyld.js';
//import { call_functions } from './modules/call';
import { syscall_functions } from './modules/syscall.js';
import { spawn_functions } from './modules/spawn.js'

//#IMPORT#//

//#END_IMPORT#//


function attach_interceptor_to_func(func) {
    if (func.ptr == 0x0){
        console.log(func.name + " not found");
        return;
    }

    if (func.cm){
        console.log(func.name, func.cm.on_enter, func.cm.on_leave);
        console.log(JSON.stringify(func.cm));
        Interceptor.attach(
            func.ptr,
            {
                onEnter: func.cm.on_enter,
                onLeave: func.cm.on_leave
            }
        );
    }
    else{
        Interceptor.attach(
            func.ptr,
            {
                onEnter: function(args: InvocationArguments) {
                    if (func.onEnter){
                        func.onEnter(args);
                    }
                },
                onLeave: function(retval: NativePointer){
                    if (func.onLeave){
                        func.onLeave(retval);
                    }
                }
            }
        );
    }
}

export function hook(modules: string[], customModules: string[]) {
//#FOREACH#//

//#END_FOREACH#//

    modules.forEach(x => {
        /*if (x === "mach"){
            import('./plugins/mach').then(module => {
                module.functions.forEach(func => attach_interceptor_to_func(func));
            });
        }*/
        if (x === "xpc"){
            xpc_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "network"){
            network_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "sqlite"){
            sqlite_functions.forEach(func => attach_interceptor_to_func(func));
            //TODO: it is not to be taken for granted that analyzed app uses sqlcipher...
            //sqlite_cipher_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "io"){
            io_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "userdefaults"){
            user_defaults_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "notifications"){
            notifications_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "keychain"){
            keychain_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "encryption"){
            encryption_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "IOKit"){
            IOKit_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "icloud"){
            icloud_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "gestalt"){
            gestalt_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "dyld"){
            dyld_functions.forEach(func => attach_interceptor_to_func(func));
        }
        /*else if (x === "call"){
            call_functions.forEach(func => attach_interceptor_to_func(func));
        }*/
        else if (x === "syscall"){
            syscall_functions.forEach(func => attach_interceptor_to_func(func));
        }
        else if (x === "spawn"){
            spawn_functions.forEach(func => attach_interceptor_to_func(func));
        }
    });

	return true;
}

export function unhook(){
    Interceptor.detachAll();
}