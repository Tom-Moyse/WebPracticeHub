import React, { useState } from 'react';
import DvdView from './DvdView';
import DvdSearchForm from './DvdSearchForm';
import DvdPostForm from './DvdPostForm';
import DvdResetButton from './DvdResetButton';
import DvdUpdateForm from './DvdUpdateForm';
import DvdDeleteForm from './DvdDeleteForm';
import '../../css/dvdcrud.css';

function DvdAPI() {
    const [refresh, setRefresh] = useState(false);
    const [form, setForm] = useState(0);
    const toggleRefresh = () => {
        setRefresh(!refresh);
    }
    const formComponents = [
        <DvdSearchForm />, 
        <DvdPostForm updateAbove={toggleRefresh}/>, 
        <DvdUpdateForm updateAbove={toggleRefresh}/>,
        <DvdDeleteForm updateAbove={toggleRefresh}/>,
        <DvdResetButton updateAbove={toggleRefresh}/>
    ];

    return ( 
        <div id="apiScreen">
            <h1>DVD Info</h1>
            <div className='formSelector'>
                <button disabled={form==0} onClick={() => setForm(0)}>Search Form</button>
                <button disabled={form==1} onClick={() => setForm(1)}>Post Form</button>
                <button disabled={form==2} onClick={() => setForm(2)}>Update Form</button>
                <button disabled={form==3} onClick={() => setForm(3)}>Delete Form</button>
                <button disabled={form==4} onClick={() => setForm(4)}>Reset Form</button>
            </div>
            <div className="apiForms">
                {formComponents[form]}
            </div>
            <div className="dvdInfo">
                <DvdView watchChange={refresh}/>
            </div>
        </div>
    );
}

export default DvdAPI;