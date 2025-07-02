export interface IFunctionPointer {
    name: string,
    ptr: NativePointer,
    onEnter?: (this: InvocationContext, args: InvocationArguments) => void,
    onLeave?: (this: InvocationContext, retval: InvocationReturnValue) => void,
    cm?: CModule
}