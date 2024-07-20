import React, { useState } from 'react';
import Input from '../../../../components/input/Input.tsx';
import DefaultButton from '../../../../components/buttons/defaultButton/DefaultButton.tsx';
import { UserProfileFormData } from '../../../../types/userFormsData.ts';
import useLoading from '../../../../hooks/useLoading.ts';
import PrivateAuthService from '../../../../services/PrivateAuth.ts';
import useUser from '../../../../hooks/useUser.ts';
import User, { UserContextType } from '../../../../types/userContext.ts';
import Loader from '../../../../components/loader/Loader.tsx';

type Props = {
    user: UserProfileFormData
}

export default function UpdateAccountForm({ user }: Props) {

    const userValue = useUser() as UserContextType;


    const [executeAsyncFunction, isLoading] = useLoading();

    // State variables to store form data
    const [formData, setFormData] = useState({
        name: user.name,
        lastname: user.lastname,
        patronymic: user.patronymic,
        email: user.email
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await executeAsyncFunction(async()=>{
            const id = (userValue.user as User).id;
            await PrivateAuthService.updateProfile(id, formData);
        })
    };

    return (
        <>
            {isLoading && <Loader/>}
            <form className='pesonal-page-account-form' onSubmit={handleSubmit}>
                <Input
                    labelName="Ім'я"
                    style={{ width: "90%" }}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <Input
                    labelName='Прізвище'
                    style={{ width: "90%" }}
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                />
                <Input
                    labelName='По-батькові'
                    style={{ width: "90%" }}
                    name="patronymic"
                    value={formData.patronymic}
                    onChange={handleInputChange}
                />
                <Input
                    labelName='Ел.пошта'
                    style={{ width: "90%" }}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <div style={{ alignSelf: "center" }}>
                    <DefaultButton type="submit">Зберігти зміни</DefaultButton>
                </div>

            </form >
        </>
    )
}
