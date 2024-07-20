import React, { useEffect, useState } from 'react';
import UserForm from '../components/UserForm.tsx';
import Input from '../../../../components/input/Input.tsx';
import DefaultButton from '../../../../components/buttons/defaultButton/DefaultButton.tsx';
import "../Forms.css";
import { RegistrationFormData } from '../../../../types/userFormsData.ts';
import AuthService from '../../../../services/AuthService.ts';
import useLoading from '../../../../hooks/useLoading.ts';
import useUser from '../../../../hooks/useUser.ts';
import AppError from '../../../../types/appError.ts';
import { UserContextType } from '../../../../types/userContext.ts';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/loader/Loader.tsx';




export default function RegistrationPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegistrationFormData>({
        name: '',
        lastname: '',
        email: '',
        patronymic: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<AppError>({});
    const [executeAsyncFunction, isLoading] = useLoading();
    const { user, setUser } = useUser() as UserContextType;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
        if (user) navigate("/", { replace: true })
    }, [user])

    const handleSubmit = async () => {
        try {
            setErrors({});

            const validationErrors: AppError = {}
            if (formData.password !== formData.confirmPassword) {
                validationErrors['confirmPassword'] = 'Паролі не співпадають';
            }

            for (const key in formData) {
                if (!formData[key as keyof RegistrationFormData]) {
                    validationErrors[key] = 'Поле не повинно бути пустим';
                }
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                validationErrors['email'] = 'Неправильний формат email';
            }

            if (Object.keys(validationErrors).length === 0) {
                await executeAsyncFunction(async () => {
                    const userData = await AuthService.registation(formData);
                    setUser(userData);
                });
            } else {
                setErrors(validationErrors);
            }
        } catch (error) {
            console.error('Виникла помилка при реєстрації:', error);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <UserForm formName='Реєстрація'>
                <div className='user-form-body-registration'>
                    <div className='user-form-body-registration-row'>
                        <div>
                            <Input
                                labelName="Ім'я"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <div className={errors["name"] ? 'input-error' : ''}>
                                {errors["name"]}
                            </div>
                        </div>
                        <div>
                            <Input
                                labelName='Прізвище'
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                            <div className={errors["lastname"] ? 'input-error' : ''}>
                                {errors["lastname"]}
                            </div>
                        </div>
                    </div>
                    <div className='user-form-body-registration-row'>
                        <div>
                            <Input
                                labelName='По-батькові'
                                name="patronymic"
                                value={formData.patronymic}
                                onChange={handleChange}
                            />
                            <div className={errors["patronymic"] ? 'input-error' : ''}>
                                {errors["patronymic"]}
                            </div>
                        </div>
                        <div>
                            <Input
                                labelName='Ел. пошта'
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <div className={errors["email"] ? 'input-error' : ''}>
                                {errors["email"]}
                            </div>
                        </div>
                    </div>
                    <div className='user-form-body-registration-row'>
                        <div>
                            <Input
                                labelName='Пароль'
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className={errors["password"] ? 'input-error' : ''}>
                                {errors["password"]}
                            </div>
                        </div>
                        <div>
                            <Input
                                labelName='Підтвердіть пароль'
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <div className={errors["confirmPassword"] ? 'input-error' : ''}>
                                {errors["confirmPassword"]}
                            </div>
                        </div>
                    </div>
                    <div className='registration-btn'>
                        <DefaultButton onClick={handleSubmit}>Зареєструватися</DefaultButton>
                    </div>
                </div>
            </UserForm>
        </>
    );

}
