import React, { useReducer } from 'react';


function countReducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {
                ...state,
                count: state.count + 1
            };
        case 'decrement':
            return {
                ...state,
                count: state.count - 1
            };
        default:
            console.error("Invalid action:",action);
            break;
    }
}

function CounterReducer() {
    // Reducer Hook
    const [state, dispatch] = useReducer(countReducer, { count: 0 });
    // State is a javascript object, and dispatch is a function that sends off actions to be processed

    // Dispatch can take any javascript object, type gives a name to the action, aby additional information can also be passed
    const increment = () => { dispatch({ type: 'increment' }); }
    const decrement = () => { dispatch({ type: 'decrement' }); }

    return (
        <>
            <h2>Counter</h2>
            <p>Count: {state.count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </>
    )
}

export default CounterReducer

/*
Move from setting state to sending actions
Before user hit a button so you incremented the counter state
Now user hits a button so you dispatch an increment action

Readability: useState is very easy to read when the state updates are simple. 
    When they get more complex, they can bloat your component’s code and make it difficult to scan. 
    In this case, useReducer lets you cleanly separate the how of update logic from the what happened of event handlers.

Debugging: When you have a bug with useState, it can be difficult to tell where the state was set incorrectly, and why.
     With useReducer, you can add a console log into your reducer to see every state update, and why it happened (due to which action).
      If each action is correct, you’ll know that the mistake is in the reducer logic itself. 
      However, you have to step through more code than with useState.
Testing: A reducer is a pure function that doesn’t depend on your component. 
    This means that you can export and test it separately in isolation. 
    While generally it’s best to test components in a more realistic environment, 
     for complex state update logic it can be useful to assert that your reducer returns a particular state for a particular initial state and action.

IMPORTANT
Must keep reducers pure
Each action is a singular interaction not necessarily single data change
*/