import ObjC from "frida-objc-bridge";

const mainThread = Process.enumerateThreads()[0];

export function follow(){
    Stalker.follow(mainThread.id);
}


export function triggerOnClass(clazz){

    ObjC.choose(ObjC.classes[clazz], {
        onMatch: function(object){
            console.log()
            console.log("==========  " + object.toString() + "  ==========");
            console.log();
            console.log("\t=== IVARS ===");
            for (let vars in object.$ivars){
                try{
                    let value = object.$ivars[vars];
                    if (value){
                        console.log("\t\t"+vars, value);
                    }
                    else{
                        console.log("\t\t"+vars, "null");
                    }
                }
                catch (e){
                    console.log("\t\t"+vars, "__DATA__");
                }
            }
            console.log();
            console.log("\t=== METHODS ===");
            console.log("\t" + object.$ownMethods);
            console.log();
            console.log("\t=== PROTOCOLS ===");
            let protoDict = object.$protocols;
            for (let proto in protoDict){
                console.log("\t\t"+proto);
                for (let method in protoDict[proto]['methods']){
                    if (protoDict[proto]['methods'][method]['required']){
                        console.log("\t\t\t"+method);
                    }
                    else{
                        console.log("\t\t\t[ " + method + "]");
                    }
                }
            }
            console.log("==================================\n");
        },
        onComplete: function(){
            console.log("Complete!");
        }
    });
}

export function callInstanceMethod(obj_addr, method, ...args){
    try {
        console.log(...args);
        var obj = new ObjC.Object(ptr(obj_addr));
        if (obj){
            console.log(obj[method](...args));
        }
    }
    catch (e){
        console.log("Error Calling method");
    }

}

export function callClassMethod(clazz, method, ...args){
    try {
        var c = ObjC.classes[clazz];
        if (c){
            console.log(c[method](...args));
        }
    }
    catch (e){
        console.log("CLASS NOT FOUND");
    }
}

export function getMemoryUsage(){
    try {
        let size: number = 0;
        let memoryRegions = Process.enumerateMallocRanges();
        for (let i = 0; i < memoryRegions.length; i++){
            size += memoryRegions[i].size;
        }
        return size;
    }
    catch (e){
        console.log("ERROR GETTING MEMORY USAGE");
    }
}
