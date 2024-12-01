export interface IFunctionPointer {
    name: string,
    ptr: NativePointer,
    onEnter?,
    onLeave?,
}

/*export interface IMessage{
    type: string,
    timestamp,
    symbol: string,
    tid,
    data: IData
}

interface IData {
    args
    ret
}*/