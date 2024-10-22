import React, { useState } from 'react';
import axios from 'axios';

function DvdResetButton({updateAbove}) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const resetDvd = (apiURL) => {
        const axiosPost = async () => {
            setLoading(true);
            try{
                const response = await axios.post(apiURL);
                console.log(response);
                if (response.status == 202){
                    setStatus('Success');
                }
            }
            catch(err){
                console.error(err.message);
                setStatus('Request Failed');
            }
            setLoading(false);
            updateAbove();
        };
        axiosPost();
    }

    return ( 
        <>
        <button onClick={() => resetDvd("http://dvd-library.us-east-1.elasticbeanstalk.com/reset")}>Reset DVDs</button>
        <div id='statusDiv'>
            {loading && 'Loading...'}
            {!loading && (status.length > 0) && 'Status: ' + status}
        </div>
        </>
    );
}

export default DvdResetButton;