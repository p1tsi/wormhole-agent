import { IFunctionPointer } from 'interfaces.js';


/*const AudioUnitInitialize: IFunctionPointer = {
    name: 'AudioUnitInitialize',
    ptr: Module.getExportByName('AudioToolbox', "AudioUnitInitialize"),
    onEnter: function(args: InvocationArguments){
        let fileUrl = ObjC.classes.NSURL.URLWithString_(
            ObjC.classes.NSString.stringWithUTF8String_(Memory.allocUtf8String("/tmp/asdasd"))
        );
        let format = ObjC.classes.AVAudioFormat.alloc().initWithCommonFormat_sampleRate_channels_interleaved_(3, 16000.0, 1, 1);
        let f = new NativeFunction(
            Module.findExportByName('AudioToolbox', 'ExtAudioFileCreateWithURL'),
            'int32',
            ['pointer', 'uint32', 'pointer', 'pointer', 'uint32', 'pointer']);
        //let s = Memory.allocUtf8String('WAVE');
        let r = f(fileUrl, 2, format.streamDescription(), ptr(0x0), 1, fileRef);
        console.log(r, fileRef);

        /*send({
		    type: 'call',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [r],
            }
	    });*/
/*    },
};

const AudioUnitUninitialize: IFunctionPointer = {
    name: 'AudioUnitUninitialize',
    ptr: Module.getExportByName('AudioToolbox', "AudioUnitUninitialize"),
    onEnter: function(args: InvocationArguments){
        let f = new NativeFunction(
            Module.findExportByName('AudioToolbox', 'ExtAudioFileDispose'),
            'int32',
            ['pointer']);
        let r = f(fileRef);
        console.log(r);

        /*send({
		    type: 'call',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [r],
            }
	    });*/
//    },
//};



const AudioUnitRender: IFunctionPointer = {
    name: 'AudioUnitRender',
    ptr: Process.getModuleByName('AudioToolbox').getSymbolByName('AudioUnitRender'),
    onEnter: function(args: InvocationArguments){
        this.a = args[5];
        /*send({
		    type: 'call',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [],
            }
	    }, args[5].add(0x10).readPointer().readByteArray(args[5].add(0xc).readU32()));*/

        //file.write(args[5].add(0x10).readPointer().readByteArray(args[5].add(0xc).readU32()))

    },
    onLeave: function(retval: NativePointer){
        send({
		    type: 'call',
		    symbol: this.name,
		    timestamp: Date.now(),
		    tid: Process.getCurrentThreadId(),
		    data: {
		        args: [],
            }
	    }, this.a.add(0x10).readPointer().readByteArray(this.a.add(0xc).readU32()));
    }
};

const AudioUnitSetProperty: IFunctionPointer = {
    name: 'AudioUnitSetProperty',
    ptr: Process.getModuleByName('AudioToolboxCore').getSymbolByName('AudioUnitSetProperty'),
    onEnter: function(args: InvocationArguments){
        if (args[1].toInt32() == 0x17){
            console.log(args[4]);
        }
    }
};




export const call_functions = [
    //AudioUnitInitialize,
    //AudioUnitUninitialize,
    AudioUnitSetProperty,
    AudioUnitRender
];