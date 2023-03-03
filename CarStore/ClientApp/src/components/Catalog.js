import React, {Component, useEffect, useState} from 'react';
import {Controller, get, useForm} from 'react-hook-form';
import MaskedInput from "react-input-mask"
import Select from 'react-select'
import {useNavigate} from "react-router-dom";
export function Catalog() {
    
    const [cars, setCars] = useState([]);
    
    const onDelete = async (e) => {
        const requestOption = {
            "method" : "POST",
        }
        
        const response = await fetch('cars/delete?id=' + e.id, requestOption);

        const fetchData = async () => {
            let response = await fetch("cars");
            setCars(await response.json())

        };

        fetchData();
        console.log(e)
    }
    
    React.useEffect(() => {
        const fetchData = async () => {
            let response = await fetch("cars");
            setCars(await response.json())
            
        };
        
        fetchData();
    }, []);
    console.log(cars);
    return  <div    >
        <div>
            {
                cars.map((item) => 
                    (<div className="d-flex justify-content-center">
                        <p className="m-2">id:{item.id} mileage:{item.mileage}</p>
                        <button className="btn btn-outline-danger m-1" onClick={() => onDelete(item)}>Удалить</button>
                    </div>)
                )
            }
        </div>
        <AddForm/>
    </div> 
}


function AddForm(){
    const navigate = useNavigate();
    const {register, control, setError, formState: {errors}, handleSubmit, getValues} = useForm({mode: "onChange"});
    
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    
    const [model, setModel] = useState();
    const [trans, setTrans] = useState();
    
    let startMake = 0, limitMakes = 10;
    let startModel = 0, limitModels = 10;
    
    React.useEffect(() => {
        const  fetchData1 = async () => {
            const response = await fetch("transmissions");
            const responseData = await response.json();

            setTransmissions(old => [...old, ...(responseData.map(trans => { return  { "value" : trans.id, "label": trans.name}}))]);
        };
        const  fetchData = async () => {
            const response = await fetch("makes?start="+startMake+"&limit="+limitMakes);
            const responseData = await response.json();
            setMakes(old => [...old, ...(responseData.map(make => { return  { "value" : make.id, "label": make.name}}))]);
            
            if(responseData.length === limitMakes){
                startMake += limitMakes;
                fetchData();
            }
                
        };
        
        fetchData();
        fetchData1();
    }, [])
    
    const onSubmit = async () => {
        const requestOption = {
            "method" : "POST",
            "headers" : {"Content-Type" : "application/json" },
            "body" : JSON.stringify({
                "modelId" : model,
                "transmissionId" : trans,
                "mileage" : getValues("mileage")
            }),
        }
        const response = await fetch('cars/add', requestOption);
        navigate('/Catalog', { replace: true });
    }
    
    const loadModels = async (makeId) => {
        const response = await fetch("models?makeId="+makeId+"&start="+startModel+"&limit="+limitModels);
        const responseData = await response.json();
        setModels(old => [...old, ...(responseData.map(model => { return  { "value" : model.id, "label": model.name}}))]);
        
        if(responseData.length === limitMakes){
            startModel += limitModels;
            loadModels(makeId);
        }
    }
    
    const makesOnChange = (make) => {
        startModel = 0;
        setModels([]);
        loadModels(make.value);
    }

    const modelOnChange = (model) => {
        setModel(model.value)
    }

    const transOnChange = (trans) => {
        setTrans(trans.value);
    }
    
    return <div>
        <form className="w-25" onSubmit={handleSubmit(onSubmit)}>
            <div >
                <label className="form-label">Производитель</label>
                <Select options={makes} onChange={makesOnChange} placeholder="Toyota"/>
                
            </div>
            <div>
                <label>Модель</label>
                <Select options={models} onChange={modelOnChange} >

                </Select>
            </div>
            <div>
                <label>Трансмиссия</label>
                <Select options={transmissions} onChange={transOnChange}>

                </Select>
            </div>
            <div>
                <label className="form-label">Пробег</label>
                <input type="number" className="form-control" {...register("mileage")}/>
            </div>
            <button type="submit" className="btn btn-outline-primary">Добавить</button>
        </form> 
    </div>
}