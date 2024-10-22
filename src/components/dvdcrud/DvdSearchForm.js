import React, { useState } from 'react';
import axios from 'axios';

function DvdSearchForm() {
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(true);
    const [searchMode, setSearchMode] = useState('title');
    const [dvds, setDvds] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let form = e.target;
        console.log(form[0].value);
        console.log(form[1].value);

        fetchResults("http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/", form[0].value, form[1].value);
        setHidden(false)
    }

    const fetchResults = (apiURL, modeParam, queryParam) => {
        const fetchDvds = async () => {
            setLoading(true);
            try{
                const response = await axios.get(apiURL + modeParam + '/' + queryParam);
                console.log(response.data);
                setDvds(response.data);
            }
            catch(err){
                console.error(err.message);
            }
            setLoading(false);
        };
        fetchDvds();
    }

    const renderSelection = () => {
        switch (searchMode) {
            case "title":
                return (<><label htmlFor='title'>Title: </label><input name="title" key={0}/></>);
            case "year":
                return (<><label htmlFor='year'>Release Year: </label><input name="year" key={1}/></>);
            case "director":
                return (<><label htmlFor='director'>Director: </label><input name="director" key={2}/></>);
            case "rating":
                return (<><label htmlFor='rating'>Rating: </label><input name="rating" key={3}/></>);
        }
    }

    return ( 
        <>
        <form onSubmit={handleSubmit}>
            <select name="searchType" onChange={(e) => {setSearchMode(e.target.value); }}>
                <option value="title">Title</option>
                <option value="year">Release Year</option>
                <option value="director">Director</option>
                <option value="rating">Rating</option>
            </select>
            {renderSelection()}
            <button type='submit'>Search</button>
        </form>
        {!hidden && (
        <div className='searchResults'>
            {loading && <div>Loading...</div>}
            {!loading && <h2>Search Result</h2>}
            {!loading && dvds.length == 0 && <div>No Results!</div>}
            {!loading && dvds.length > 0 && (
            <div>
                <table>
                    <thead>
                        <tr>
                        <td>ID</td>
                        <td>Title</td>
                        <td>Release Year</td>
                        <td>Director</td>
                        <td>Rating</td>
                        <td>Notes</td>
                        </tr>
                    </thead>
                    <tbody>
                    {dvds.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.releaseYear}</td>
                            <td>{item.director}</td>
                            <td>{item.rating}</td>
                            <td>{item.notes}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
        )}
        </>
    );
}

export default DvdSearchForm;