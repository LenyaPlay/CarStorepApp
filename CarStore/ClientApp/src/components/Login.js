import React, {Component, useState} from 'react';
import {Controller, get, useForm} from 'react-hook-form';
import MaskedInput from "react-input-mask"
import {useNavigate} from "react-router-dom";

export function Login() {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        setError,
        getValues,
        setValue,
        control
    } = useForm({
        mode: "all",
        defaultValues: {
            "hasEmail" : true
        }
    });

    const [response, setResponse] = useState()
    const [responseData, setResponseData] = useState({});

    const navigate = useNavigate();
    
    const onSubmit = async () => {
        const requestOption = {
            "method" : "POST",
            "headers" : {"Content-Type" : "application/json" },
            "body" : JSON.stringify({
                "login" : getValues("login"),
                "password" : getValues("password"),
            }),
        }
        const response = await fetch('auth/login', requestOption);
        
        setResponse(response);
        setResponseData(await response.json());
        //TODO remove after debug
        console.log(response);
    }

    if(response?.status === 200)
        navigate('/Catalog', { replace: true });

    return (
        <div>
            <div className="d-flex justify-content-center mt-5 my-3"><h1 className="mt-5">Вход</h1></div>
            <div className="d-flex justify-content-center">
                <form className="w-25" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="form-label"> Логин</label>
                        <input className={"form-control "} {...register("login", {
                            required: "Обязательное поле",
                            pattern: {
                                value: /^[a-zA-Z0-9]{3,16}$/,
                                message: "Логин не должен содержать специальных символов"
                            },
                            minLength: {
                                value: 3, message: "Логин должен быть не менее 3 символов",
                            }, maxLength: {
                                value: 16, message: "Логин должен быть не более 16 символов",
                            },
                        })}/>
                        {errors.login && <div className="text-danger">{errors.login.message}</div>}
                    </div>

                    <div className="text-wrap">
                        <label className="form-label"> Пароль</label>
                        <input className="form-control" {...register("password", {
                            minLength: {
                                value: 8, message: "Пароль должен быть не менее 8 символов",
                            }, maxLength: {
                                value: 256, message: "Пароль должен быть не более 256 символов"
                            }, required: "Введите пароль (от 8 до 256 символов)",
                        })}/>
                        {errors.password && <div className="text-danger">{errors.password.message}</div>}
                    </div>
                    {response?.status !== 200 && <div className={"text-danger"}>{responseData.message}</div>}
                    <div className={"d-flex justify-content-center"}>
                        <button className="btn mt-2 btn-outline-primary"> Войти</button>
                    </div>
                </form>
            </div>
        </div>);
}
