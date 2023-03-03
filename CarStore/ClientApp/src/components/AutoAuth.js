import React, {Component, useState} from 'react';
import {Controller, get, useForm} from 'react-hook-form';
import {useNavigate} from "react-router-dom";

export function AutoAuth() {
    const [response, setResponse] = useState()
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('auth/checksessionid');
            setResponse(response);
        }
        
        fetchData();
    });
    
    if(response?.status === 200)
        navigate('/Catalog', { replace: true });
    
    if(response?.status === 400)
        navigate('/Login', { replace: true });
    
    return <div>Автоматическая авторизация</div>
}
