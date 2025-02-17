import { useState } from "react";

export class DoubleBind{

    value;
    _handler;

    set(val){
        this.value = val;
        this._handler(this.value);
    };

    constructor(){
        [this.value, this._handler] = useState('');
    }
}
