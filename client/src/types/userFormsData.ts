export type RegistrationFormData ={
        name: string;
        lastname: string;
        email: string;
        patronymic: string;
        password: string;
        confirmPassword: string;
}

export type LoginFormData = Pick<RegistrationFormData, 'email'|'password'>


export type UserProfileFormData = Omit<RegistrationFormData, "confirmPassword" | "password">
