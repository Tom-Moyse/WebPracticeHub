import React from 'react';
import Navbar from './Navbar';

function PageTemplate({ PageItemComponent }) {
    return ( 
        <div className='App'>
            <Navbar />
            <PageItemComponent />
        </div>
     );
}

export default PageTemplate;