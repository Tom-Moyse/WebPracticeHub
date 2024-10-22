import React from 'react';
import { Link } from 'react-router-dom'

function Navbar() {
    return ( 
        <div className='hoverCapture'>
        <div className='navbar'>
            <Link to="/home">Home</Link>
            <Link to="/calculator">Calculator</Link>
            <Link to="/counter">Counter (state)</Link>
            <Link to="/counter2">Counter (reducer)</Link>
            <Link to="/counter3">Counter (reducer+)</Link>
            <Link to="/fetch">Basic Fetch</Link>
            <Link to="/dvd">DVD API</Link>
            <Link to="/visualiser">Audio Visualiser</Link>
            <Link to="/goblintower">Goblin Tower</Link>
        </div>
        </div>
    );
}

export default Navbar;