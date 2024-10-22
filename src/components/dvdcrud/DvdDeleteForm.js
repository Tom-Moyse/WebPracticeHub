import React, { useState } from 'react';
import axios from 'axios';

function DvdDeleteForm({updateAbove}) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        deleteDvd("http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/", e.target.id.value);
    }

    const deleteDvd = (apiURL, id) => {
        const axiosPost = async () => {
            setLoading(true);
            try{
                const response = await axios.delete(apiURL + id);
                console.log(response);
                if (response.status == 200){
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
        <form onSubmit={handleSubmit}>
            <label htmlFor='id'>ID: </label>
            <input name="id" id='id'/>
            <button type='submit'>Delete</button>
        </form>
        <div id='statusDiv'>
            {loading && 'loading...'}
            {!loading && (status.length > 0) &&'Status: ' + status}
        </div>
        </>
    );
}

export default DvdDeleteForm;