import React, { useState, useReducer } from 'react';


function countReducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {
                ...state,
                count: state.count + parseFloat(action.amount)
            };
        case 'decrement':
            return {
                ...state,
                count: state.count - parseFloat(action.amount)
            };
        default:
            console.error("Invalid action:",action);
            break;
    }
}

function CounterReducer2() {
    // Reducer Hook
    const [state, dispatch] = useReducer(countReducer, { count: 0 });
    const [incrementAmount, setIncrementAmount] = useState(1);

    // Dispatch can take any javascript object, type gives a name to the action, aby additional information can also be passed e.g. amount
    const increment = () => { dispatch({ type: 'increment', amount: incrementAmount }); }
    const decrement = () => { dispatch({ type: 'decrement', amount: incrementAmount }); }

    return (
        <>
            <h2>Counter</h2>
            <p>Count: {state.count}</p>
            <label htmlFor='incamount'>Increment Amount: </label>
            <input name='incamount' type='number' onChange={(e) => setIncrementAmount(e.target.value)}></input>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </>
    )
}

export default CounterReducer2;