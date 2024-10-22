import React, { useState } from 'react';
import axios from 'axios';

function DvdUpdateForm({updateAbove}) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let jsonData = Object.fromEntries(formData.entries());
        let id = jsonData['id'];
        delete jsonData['id'];

        putDvd("http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/", jsonData, id);
    }

    const putDvd = (apiURL, dvdObj, id) => {
        const axiosPost = async () => {
            setLoading(true);
            try{
                const response = await axios.put(apiURL + id, dvdObj);
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
            <label htmlFor='title'>Title: </label>
            <input name="title" id="title"/>
            <label htmlFor='releaseYear'>Release Year: </label>
            <input type='number' name="releaseYear" id="releaseYear"/>
            <label htmlFor='director'>Director: </label>
            <input name="director" id="director"/>
            <label htmlFor='rating'>Rating: </label>
            <input name="rating" id="rating"/>
            <label htmlFor='notes'>Notes: </label>
            <input name="notes" id="notes"/>
            <button type='submit'>Submit</button>
        </form>
        <div id='statusDiv'>
            {loading && 'loading...'}
            {!loading && (status.length > 0) &&'Status: ' + status}
        </div>
        </>
    );
}

export default DvdUpdateForm;