import { IFunctionPointer } from './interfaces.js';
import { libCommonCryptoDylib } from '../../lib/libraries.js';

const p_CCCryptorCreateWithMode = Process.getModuleByName(libCommonCryptoDylib).getSymbolByName("CCCryptorCreateWithMode");
//const p_CCCryptorCreate = Process.getModuleByName(libCommonCryptoDylib).getSymbolByName("CCCryptorCreate");
const p_CCCryptorRelease = Process.getModuleByName(libCommonCryptoDylib).getSymbolByName("CCCryptorRelease");
const p_CCCryptorUpdate = Process.getModuleByName(libCommonCryptoDylib).getSymbolByName("CCCryptorUpdate");
const p_CCCryptorFinal = Process.getModuleByName(libCommonCryptoDylib).getSymbolByName("CCCryptorFinal");
const p_CCCryptorGetOutputLength = Process.getModuleByName(libCommonCryptoDylib).getSymbolByName("CCCryptorGetOutputLength");



const CCCryptorCreateWithMode: IFunctionPointer = {
    name: 'CCCryptorCreateWithMode',
    ptr: p_CCCryptorCreateWithMode,
    onEnter: function(args: InvocationArguments){
        let op = args[0];   // 0->encrypt, 1-> decrypt
        let mode = args[1];
        let algo = args[2];
        let padding = args[3];   // 0-> no padding; 1-> PKCS7 padding

        let keyLen = args[6].toInt32();
        let key = args[5].readByteArray(keyLen);

        if (args[4].toString() != '0x0'){
            let data = Memory.alloc(keyLen + 16);
            data.writeByteArray(key);
            let pIV = data.add(keyLen);
            let iv = args[4].readByteArray(16);
            pIV.writeByteArray(iv);
            send({
                type: 'encryption',
                tid: Process.getCurrentThreadId(),
                timestamp: Date.now(),
                symbol: this.name,
                data: {
                    args: [
                        op,        //ENC (0x0) - DEC(0x1)
                        mode,      // MODE (ecb, cbc, ...)
                        algo,      // ALGORITHM (DES, AES, ...)
                        padding,
                        1,          // IV exists
                        keyLen
                    ]
                }
            }, data.readByteArray(keyLen + 16));
        }
        else{
            send({
                type: 'encryption',
                tid: Process.getCurrentThreadId(),
                timestamp: Date.now(),
                symbol: this.name,
                data: {
                    args: [
                        op,        //ENC (0x0) - DEC(0x1)
                        mode,      // MODE (ecb, cbc, ...)
                        algo,      // ALGORITHM (DES, AES, ...)
                        padding,
                        0,
                        keyLen
                    ]
                }
            }, key);
        }
    }
};

const CCCryptorGetOutputLength: IFunctionPointer = {
    name: 'CCCryptorGetOutputLength',
    ptr: p_CCCryptorGetOutputLength,
    onEnter: function(args: InvocationArguments){
        this.cryptor = args[0];
        this.inputLength = args[1].toInt32();
    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'encryption',
		    tid: Process.getCurrentThreadId(),
		    timestamp: Date.now(),
            symbol: this.name,
		    data: {
		        args: [this.cryptor, this.inputLength]
            }
	    });
    }
};


const CCCryptorUpdate: IFunctionPointer = {
    name: 'CCCryptorUpdate',
    ptr: p_CCCryptorUpdate,
    onEnter: function(args: InvocationArguments){
        //log(`CCCryptorUpdate(cryptorRef=${args[0]}, dataIn=${args[1]}, dataInLength=${args[2]}, dataOut=${args[3]}, dataOutAvailable=${args[4]}, dataOutMoved=${args[5]})`);
        this.dataInLen = args[2].toInt32();
        this.dataIn = args[1];
        this.dataOut = args[3];
        this.dataOutLen = args[5];
    },
    onLeave: function(retval: NativePointer){
        let dataOutLen = this.dataOutLen.readInt();
        let totLen = this.dataInLen + dataOutLen;
        let data = Memory.alloc(totLen);
        data.writeByteArray(this.dataIn.readByteArray(this.dataInLen));
        let dataOutStart = data.add(this.dataInLen);
        dataOutStart.writeByteArray(this.dataOut.readByteArray(dataOutLen))
        send({
		    type: 'encryption',
		    tid: Process.getCurrentThreadId(),
		    timestamp: Date.now(),
            symbol: this.name,
		    data: {
		        args: [this.dataInLen]
            }
	    }, data.readByteArray(totLen));
    }
};

const CCCryptorFinal: IFunctionPointer = {
    name: 'CCCryptorFinal',
    ptr: p_CCCryptorFinal,
    onEnter: function(args: InvocationArguments){
        //log(`CCCryptorFinal(cryptorRef=${args[0]}, dataOut=${args[1]}, dataOutAvailable=${args[2]}, dataOutMoved=${args[3]})`);
        this.dataOutMoved = args[3];
        this.data = args[1];
    },
    onLeave: function(retval: NativePointer){
        let len = this.dataOutMoved.readInt();
        this.data = this.data.readByteArray(len);
        send({
		    type: 'encryption',
		    tid: Process.getCurrentThreadId(),
		    timestamp: Date.now(),
            symbol: this.name,
		    data: {
		        args: [len]
            }
	    }, this.data);
    }
};

const CCCryptorRelease: IFunctionPointer = {
    name: 'CCCryptorRelease',
    ptr: p_CCCryptorRelease,
    onEnter: function(args: InvocationArguments){
        send({
		    type: 'encryption',
		    tid: Process.getCurrentThreadId(),
		    timestamp: Date.now(),
            symbol: this.name,
		    data: {
		        args: []
            }
	    });
    }
};


export const encryption_functions = [
    CCCryptorCreateWithMode,
    //CCCryptorCreate,
    CCCryptorUpdate,
    CCCryptorGetOutputLength,  // remove?
    CCCryptorFinal,
    CCCryptorRelease
]
