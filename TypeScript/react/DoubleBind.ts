import { ReactNode, useState } from "react";

export class DoubleBind{

    value: string | ReactNode;
    _handler: Function;

    set(val: string | ReactNode){
        this.value = val;
        this._handler(this.value);
    };

    constructor(){
        [this.value, this._handler] = useState('');
    }
}
