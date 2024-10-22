import React from 'react';

function ResultLabel({num, result}) {
    const getLabel = () => {
        if (num){
            return num
        }
        if (result != null){
            return result;
        }
        return '0';
    };

    return ( 
        <div className='resultdisplay'>
            {getLabel()}
        </div>
     );
}

export default ResultLabel;