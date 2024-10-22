import React, { useState, useEffect } from 'react';

const apiUrl = "http://contactlist.us-east-1.elasticbeanstalk.com/contacts";

const FetchDataComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok){
                    throw new Error('Connection failed');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();

    }, []);

    if(loading){
        return (<div>Loading... </div>)
    }

    if(error){
        return (<div>Error: {error.message}</div>)
    }

    return(
        <div>
            <h2>Fetched Data</h2>
            <div>
                {JSON.stringify(data)}
            </div>
        </div>
    )
};

export default FetchDataComponent;