import React, {Component, useEffect, useState} from 'react';
import {Controller, get, useForm} from 'react-hook-form';
import MaskedInput from "react-input-mask"
import {useSearchParams} from "react-router-dom";

export function Activate() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [response, setResponse] = useState([]);
    const [data, setData] = useState({});
    
    React.useEffect(() => {
        const fetchData = async () => {
            const resp = await fetch('auth/activate?id=' + searchParams.get("id")+ '&token=' + searchParams.get("token"));
            setResponse(resp);
            setData(await resp.json());
        };
        
        fetchData();
        
    }, [])
    
    return  response != null && 
        <div className="d-flex justify-content-center">
            <div className={response.status === 200 ? "text-success" : "text-danger"}>{data.message}</div>
        </div>;

}
