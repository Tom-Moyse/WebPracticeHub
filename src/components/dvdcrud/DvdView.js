import React, { useState, useEffect } from 'react';
import axios from 'axios'

function DvdView({watchChange}) {
    const [loading, setLoading] = useState(true);
    const [dvds, setDvds] = useState([]);

    useEffect(() => {
        const fetchDvds = async () => {
            setLoading(true);
            try{
                const response = await axios.get("http://dvd-library.us-east-1.elasticbeanstalk.com/dvds");
                setDvds(response.data);
            }
            catch(err){
                console.error(err.message);
            }
            setLoading(false);
        };
        fetchDvds();
    }, [watchChange]);

    return ( 
        <>
            {loading && <div>Loading...</div>}
            {!loading && (
            <div>
                <h2>All DVD Data</h2>
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
        </>
     );
}

export default DvdView;