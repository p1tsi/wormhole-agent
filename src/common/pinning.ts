import { libBoringsslDylib } from "./lib/libraries.js";

export default function certPinning() {
  let res = false;
  let SSL_set_custom_verify_ptr = Process.getModuleByName(
    libBoringsslDylib,
  ).getExportByName("SSL_set_custom_verify");
  let SSL_CTX_set_custom_verify_ptr = Process.getModuleByName(
    libBoringsslDylib,
  ).getExportByName("SSL_CTX_set_custom_verify");

  // Custom callback
  const retZeroCallback = new NativeCallback(
    function (_ssl, _out_alert) {
      return 0;
    },
    "int",
    ["pointer", "pointer"],
  );

  if (SSL_set_custom_verify_ptr) {
    const o_SSL_set_custom_verify = new NativeFunction(
      SSL_set_custom_verify_ptr,
      "void",
      ["pointer", "int", "pointer"],
    );

    Interceptor.replace(
      o_SSL_set_custom_verify,
      new NativeCallback(
        function (ssl, mode, _callback) {
          o_SSL_set_custom_verify(ssl, mode, retZeroCallback);
        },
        "void",
        ["pointer", "int", "pointer"],
      ),
    );
    //console.log("SSL_set_custom_verify REPLACED!");
    res = true;
  }

  if (SSL_CTX_set_custom_verify_ptr) {
    const o_SSL_CTX_set_custom_verify = new NativeFunction(
      SSL_CTX_set_custom_verify_ptr,
      "void",
      ["pointer", "int", "pointer"],
    );

    Interceptor.replace(
      o_SSL_CTX_set_custom_verify,
      new NativeCallback(
        function (ssl, mode, _callback) {
          o_SSL_CTX_set_custom_verify(ssl, mode, retZeroCallback);
        },
        "void",
        ["pointer", "int", "pointer"],
      ),
    );
    //console.log("SSL_CTX_set_custom_verify REPLACED!");
    res = true;
  }

  return res;
}
