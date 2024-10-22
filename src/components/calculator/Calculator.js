import React, { useState } from 'react';
import ResultLabel from './ResultLabel';
import InputButton from './InputButton';
import '../../css/calculator.css'


function Calculator() {
    const [num, setNum] = useState('');
    const [op, setOp] = useState(null);
    const [prevNum, setPrevNum] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const maxDigits = 15;

    const appendNum = (val) => {
        console.log(prevNum, num, op);
        if (disabled){ return; }
        setNum((num + val).slice(0, maxDigits));
    }
    const popNum = () => {
        if (disabled){ return; }
        setNum(num.slice(0, -1));
    }

    const processOp = (func) => {
        if (disabled) { return; }
        console.log(prevNum, num, op);
        if (op == null && num.length > 0){
            setPrevNum(num);
            setNum('');
        }
        else if (op != null){
            let r = op(parseFloat(prevNum), parseFloat(num)).toString();
            if (r.length > maxDigits){
                setPrevNum("OVERFLOW");
                setNum("OVERFLOW");
                setDisabled(true);
                return;
            }
            else if (r == "NaN"){
                setPrevNum("BAD INPUT");
                setNum("BAD INPUT");
                setDisabled(true);
                return;
            }
            setPrevNum(r);
            setNum('');
        }
        setOp(() => func);
    }

    const processEq = () => {
        if (disabled){ return; }
        console.log(prevNum, num, op);
        if (prevNum != null){
            let r = op(parseFloat(prevNum), parseFloat(num)).toString();
            if (r.length > maxDigits){
                setPrevNum("OVERFLOW");
                setNum("OVERFLOW");
                setDisabled(true);
                return;
            }
            setPrevNum(r);
            setNum('');
            setOp(null);
        }
    }

    const clearAll = () => {
        setNum('');
        setOp(null);
        setPrevNum(null);
        setDisabled(false);
    }

    return ( 
        <div className='calcWidget'>
            <h1>Calculator</h1>
            <div className='calculator'>
                <ResultLabel num={num} result={prevNum}/>
                <div className='buttons'>
                    <InputButton label='7' callback={appendNum}/>
                    <InputButton label='8' callback={appendNum}/>
                    <InputButton label='9' callback={appendNum}/>
                    <InputButton label='/' callback={() => { processOp( (x1,x2) => {return x1/x2} ) } }/>
                    <InputButton label='4' callback={appendNum}/>
                    <InputButton label='5' callback={appendNum}/>
                    <InputButton label='6' callback={appendNum}/>
                    <InputButton label='*' callback={() => { processOp( (x1,x2) => {return x1*x2} ) } }/>
                    <InputButton label='1' callback={appendNum}/>
                    <InputButton label='2' callback={appendNum}/>
                    <InputButton label='3' callback={appendNum}/>
                    <InputButton label='-' callback={() => { processOp( (x1, x2) => {return x1-x2} ) } }/>
                    <InputButton label='0' callback={appendNum}/>
                    <InputButton label='.' callback={appendNum}/>
                    <InputButton label='=' callback={processEq}/>
                    <InputButton label='+' callback={() => { processOp( (x1, x2) => {return x1+x2} ) } }/>
                    <InputButton label='DEL' callback={popNum}/>
                    <InputButton label='AC' callback={clearAll}/>
                </div>
            </div>
        </div>
     );
}

export default Calculator;