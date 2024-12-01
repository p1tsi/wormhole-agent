
const paths = [
    "/Applications/blackra1n.app",
    "/Applications/Cydia.app",
    "/Applications/FakeCarrier.app",
    "/Applications/Icy.app",
    "/Applications/IntelliScreen.app",
    "/Applications/MxTube.app",
    "/Applications/RockApp.app",
    "/Applications/SBSetttings.app",
    "/Applications/WinterBoard.app",
    "/Applications/Filza.app",
    "/bin/bash",
    "/bin/sh",
    "/bin/su",
    "/etc/apt",
    "/Library/MobileSubstrate/DynamicLibraries/SSHConnect.plist",
    "/Library/MobileSubstrate/DynamicLibraries/SSHConnect.dylib",
    "/Library/MobileSubstrate/DynamicLibraries/MobileSafety.dylib",
    "/Library/MobileSubstrate/DynamicLibraries/MobileSafety.plist",
    "/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
    "/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
    "/Library/MobileSubstrate/MobileSubstrate.dylib",
    "/pguntether",
    "/private/var/lib/cydia",
    "/private/var/lib/apt",
    "/private/var/lib/apt/",
    "/private/var/lib/cydia",
    "/private/var/mobile/Library/SBSettings/Themes",
    "/private/var/stash",
    "/private/var/tmp/cydia.log",
    "/System/Library/LaunchDaemons/com.ikey.bbot.plist",
    "/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
    "/usr/bin/cycript",
    "/usr/bin/ssh",
    "/usr/bin/sshd",
    "/usr/libexec/sftp-server",
    "/usr/libexec/ssh-keysign",
    "/usr/sbin/frida-server",
    "/usr/sbin/sshd",
    "/var/cache/apt",
    "/var/lib/cydia",
    "/var/log/syslog",
    "/var/mobile/Media/.evasi0n7_installed",
    "/var/tmp/cydia.log",
    "/etc/ssh/sshd_config"
];

export default function jbcheckbypass() {
    Interceptor.attach(ObjC.classes.NSFileManager["- fileExistsAtPath:"].implementation, {
        onEnter(args) {
            this.is_common_path = false;
            this.path = new ObjC.Object(args[2]).toString();
            if (paths.indexOf(this.path) >= 0) {
                this.is_common_path = true;
            }
        },
        onLeave(retval) {
            if (!this.is_common_path) {
                return;
            }

            if (retval.isNull()) {
                return;
            }
            retval.replace(new NativePointer(0x0));
        },
    });

    //Hooking canOpenURL for Cydia
    Interceptor.attach(ObjC.classes.UIApplication["- canOpenURL:"].implementation, {
        onEnter(args) {
            this.is_flagged = false;
            this.path = new ObjC.Object(args[2]).absoluteString();
            if (this.path.isEqualToString_(ObjC.classes.NSString.stringWithUTF8String_(Memory.allocUtf8String("cydia://")))) {
                this.is_flagged = true;
            }
        },
        onLeave(retval) {
            if (!this.is_flagged) {
                return;
            }

            // ignore failed
            if (retval.isNull()) {
                return;
            }
            retval.replace(new NativePointer(0x0));
        }
    });
    return true;
}