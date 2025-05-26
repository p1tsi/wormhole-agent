export interface IFunctionPointer {
    name: string,
    ptr: NativePointer,
    onEnter?,
    onLeave?,
    cm?
}