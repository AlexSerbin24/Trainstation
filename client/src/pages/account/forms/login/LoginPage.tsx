import React, { useEffect, useState } from 'react';
import UserForm from '../components/UserForm.tsx';
import Input from '../../../../components/input/Input.tsx';
import DefaultButton from '../../../../components/buttons/defaultButton/DefaultButton.tsx';
import "../Forms.css";
import AuthService from '../../../../services/AuthService.ts';
import useLoading from '../../../../hooks/useLoading.ts';
import useUser from '../../../../hooks/useUser.ts';
import AppError from '../../../../types/appError.ts';
import { UserContextType } from '../../../../types/userContext.ts';
import {useNavigate } from 'react-router-dom';
import Loader from '../../../../components/loader/Loader.tsx';

export default function LoginPage() {
    const navigate = useNavigate();

    ;

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<AppError>({});
    const [executeAsyncFunction, isLoading] = useLoading();
    const {user, setUser} = useUser() as UserContextType;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
      if(user) navigate("/", {replace:true})
    }, [user])
    

    const handleSubmit = async () => {
        try {
            setErrors({});

            const validationErrors: AppError = {}
            for (const key in formData) {
                if (!formData[key as keyof typeof formData]) {
                    validationErrors[key] = 'Поле не повинно бути пустим';
                }
            }

            if (Object.keys(validationErrors).length === 0) {
                await executeAsyncFunction(async () => {
                    const userData = await AuthService.login(formData);
                    setUser(userData);
                    
                });
            } else {
                setErrors(validationErrors);
            }
        } catch (error) {
            console.error('Виникла помилка при вході:', error);
        }
    };

    return (
        <>
        {isLoading &&<Loader/>}
        <UserForm formName='Вхід'>
            <div className='user-form-body-login'>
                <div style={{marginBottom:15}}>
                    <Input
                        labelName='Ел. пошта'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <div className={errors["email"] ? 'input-error' : ''}>
                        {errors["email"]}
                    </div>
                </div>
                <div style={{marginBottom:15}}>
                    <Input
                        labelName='Пароль'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className={errors["password"] ? 'input-error' : ''}>
                        {errors["password"]}
                    </div>
                </div>
                <div>
                    <DefaultButton onClick={handleSubmit}>Вхід</DefaultButton>
                </div>
            </div>
        </UserForm>
        </>
    );
}
