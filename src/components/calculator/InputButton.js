import React from 'react';

function InputButton({label, callback}) {
    return ( 
        <button onClick={() => {callback(label)}}>
            {label}
        </button>
    );
}

export default InputButton;