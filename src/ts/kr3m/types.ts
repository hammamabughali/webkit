type CB<T> = (result:T) => void;
type AnyCallback = CB<any>;
type BooleanCallback = CB<boolean>;
type Callback = () => void;
type StringCallback = CB<string>;
type StatusCallback = StringCallback;
type ErrorCallback = StringCallback
type SuccessCallback = BooleanCallback;
type NumberCallback = CB<number>;
type ParamsCallback = (...params:any[]) => void;

type TextMap = {[id:string]:{toString:() => string}};
type Tokens = TextMap;
type LocFunc = (id:string, tokens?:Tokens) => string;
