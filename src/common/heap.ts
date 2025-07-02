import ObjC from "frida-objc-bridge";

function parseIvars(obj){
    let ivars = {}
    let _ivars = []
    ivars['description'] = obj.toString()
    ivars['ptr'] = obj['handle'].toString()
    ivars['isa'] = obj.$className
    for (let ivar in obj.$ivars){
        try{
            let value = obj.$ivars[ivar];
            if (typeof value == 'object'){
                if (!value){
                    _ivars.push({name: ivar, value: "Null"})
                }
                else{
                    if (value['handle']){
                        _ivars.push({name: ivar, value: value.toString(), ptr: value['handle'].toString()})
                    }
                    else{
                        _ivars.push({name: ivar, value: value.toString()})
                    }
                }
            }
            else{
                _ivars.push({name: ivar, value: value.toString()})
            }
        }
        catch (e){
            _ivars.push({name: ivar, value: "__ERROR__"})
        }
    }
    ivars['ivars'] = _ivars;
    return ivars;
}


export function getivarsbyobject(objPtr: string){
    let obj = new ObjC.Object(ptr(objPtr));
    //console.log(obj);
    return parseIvars(obj);
}

export function inspect(classes: string) {
    let foundObjs = ObjC.chooseSync(ObjC.classes[classes])
    if (foundObjs.length == 0){
        return [];
    }
    const foundClasses = [];
    foundObjs.forEach(obj => {
        //console.log(obj);
        foundClasses.push(parseIvars(obj));
    });
    return foundClasses;
}