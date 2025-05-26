import {
    libBoringsslDylib,
    frameworkSecurity
} from './lib/libraries'


export default function certPinning() {

    let res = false;
    let SSL_set_custom_verify_ptr = Module.findExportByName(libBoringsslDylib, 'SSL_set_custom_verify');
    let SSL_CTX_set_custom_verify_ptr = Module.findExportByName(libBoringsslDylib, 'SSL_CTX_set_custom_verify');

    // Custom callback
    const customVerifyCallback = new NativeCallback(
        function (ssl, out_alert) {
            return 0;
        },
        "int",
        ["pointer", "pointer"]
    );

    if (SSL_set_custom_verify_ptr){
        const func_to_replace = new NativeFunction(
            SSL_set_custom_verify_ptr,
            "void",
            ["pointer", "int", "pointer"]
        );

        Interceptor.replace(
            func_to_replace,
            new NativeCallback(
                function (ssl, mode, callback) {
                    func_to_replace(ssl, mode, customVerifyCallback);
                },
                "void",
                ["pointer", "int", "pointer"]
            )
        );
        //console.log("SSL_set_custom_verify REPLACED!");
        res = true;
    }


    if (SSL_CTX_set_custom_verify_ptr){
        const func_to_replace = new NativeFunction(
            SSL_CTX_set_custom_verify_ptr,
            "void",
            ["pointer", "int", "pointer"]
        );

        Interceptor.replace(
            func_to_replace,
            new NativeCallback(
                function (ssl, mode, callback) {
                    func_to_replace(ssl, mode, customVerifyCallback);
                },
                "void",
                ["pointer", "int", "pointer"]
            )
        );
        //console.log("SSL_CTX_set_custom_verify REPLACED!");
        res = true;
    }

    return res;
}