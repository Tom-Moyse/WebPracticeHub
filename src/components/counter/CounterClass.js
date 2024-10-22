import React, { Component } from 'react';

class CounterClass extends Component {
    constructor(props){
        super(props);
        this.state = {
            count: 0
        };
    }

    increment = () => {
        this.setState((prevState) => ({
            count: prevState.count + 1
        }));
    };

    decrement = () => {
        this.setState((prevState) => ({
            count: prevState.count - 1
        }));
    };

    render() {
        return (
            <>
                <h2>Counter</h2>
                <p>Count: {this.state.count}</p>
                <button onClick={this.increment}>Increment</button>
                <br />
                <button onClick={this.decrement}>Decrement</button>
            </>
        )
    }
}

export default CounterClass