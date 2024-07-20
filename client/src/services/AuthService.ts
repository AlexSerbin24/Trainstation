import axios from "axios";
import { LoginFormData, RegistrationFormData, UserProfileFormData } from "../types/userFormsData.ts";
import UserData from "../types/userData.ts";


export default class AuthService {
    private static baseUrl = 'http://localhost:3001/auth';
    
    static async registation(data:RegistrationFormData){
        const response = await axios.post<UserData>(`${this.baseUrl}/register`,data,{withCredentials:true});
        const {accessToken, ...result} = response.data;
        localStorage.setItem("access_token", accessToken);
        return result;
    }

    static async login(data:LoginFormData){
        const response = await axios.post<UserData>(`${this.baseUrl}/login`,data,{withCredentials:true});
        const {accessToken, ...result} = response.data;
        localStorage.setItem("access_token", accessToken);
        return result;
    }

    static async refresh(){
        const response = await axios.post<UserData>(`${this.baseUrl}/refresh_token`,undefined,{withCredentials:true});
        console.log(response.data)
        const {accessToken, ...result} = response.data;
        localStorage.setItem("access_token", accessToken);
        return result;
    }


    


}
