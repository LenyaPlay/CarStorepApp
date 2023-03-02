import React, {Component, useState} from 'react';
import {Controller, get, useForm} from 'react-hook-form';
import MaskedInput from "react-input-mask"

export function Register() {
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
    
    const onSubmit = async () => {
        const requestOption = {
            "method" : "POST",
            "headers" : {"Content-Type" : "application/json" },
            "body" : JSON.stringify({
                "login" : getValues("login"),
                "password" : getValues("password"),
                "email" : getValues("email"),
            }),
        }
        const response = await fetch('auth/register', requestOption);
        setResponse(response);
        setResponseData(await response.json());
        //TODO remove after debug
        console.log(response);
    }

    const emailOrPhoneChange = e => {
        if (!getValues("hasEmail")/*&& !getValues("hasPhoneNumber")*/) {
            //ToDo
            setValue("hasEmail", true);
            setValue("hasPhoneNumber", false)
            setError("hasEmail", {message: "Необходимо выбрать хотя бы один из способов. К сожалению пока доступна регистрация только с использованием почты"});
        }
    }

    if(response?.status === 200)
        return <div>На вашу почту отправлено сообщение для активации аккаунта</div>;
    
    return (
        <div>
            <div className="d-flex justify-content-center mt-5 my-3"><h1 className="mt-5">Регистрация</h1></div>
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
                    {errors.hasEmail && <div className="text-danger">{errors.hasEmail.message}</div>}
                    <div className="form-check">
                        <label className={"form-check-label"}> Почта</label>
                        <input className="form-check-input"  {...register("hasEmail", {
                            onChange: emailOrPhoneChange })} type="checkbox"/>
                    </div>
                    {getValues("hasEmail") && <div>
                        <input className="form-control" {...register("email", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Введите действительную почту",
                            }, maxLength: {
                                value: 320, message: "Почта должна быть не более 320 символов",
                            }, required: "Введите почту",
                        })}/>
                        {errors.email && <div className="text-danger">{errors.email.message}</div>}
                    </div>}

                    <div className="form-check">
                        <label className={"form-check-label"}> Номер телефона</label>
                        <input className="form-check-input" {...register("hasPhoneNumber", {
                            onChange: emailOrPhoneChange,
                            required: false,
                            disabled: true,
                        })} type="checkbox"/>
                    </div>

                    {watch("hasPhoneNumber") && <div>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: "Введите номер телефона или уберитe галочку",
                                pattern: {
                                    value: /\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/,
                                    message: "Введите действительный номер телефона"
                                },
                            }}
                            render={({field}) => (
                                <MaskedInput className={"form-control"}
                                             mask="+7 (999) 999-99-99"
                                             maskChar=""
                                             value={field.value}
                                             onChange={field.onChange}
                                             placeholder="+7 (xxx) xxx-xx-xx"
                                >
                                    {(inputProps) => (
                                        <input
                                            {...inputProps}
                                            type="text"
                                        />
                                    )}
                                </MaskedInput>
                            )}
                        />
                        {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber.message}</div>}
                    </div>
                    }

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
                        <button className="btn mt-2 btn-outline-primary"> Регистрация</button>
                    </div>
                </form>
            </div>
        </div>);
}
