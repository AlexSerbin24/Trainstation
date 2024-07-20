import { UserProfileFormData } from "../types/userFormsData.ts";
import createAxiosInstance from "../api/authAxios.ts";


export default class PrivateAuthService {

    private static privateAxios = createAxiosInstance('http://localhost:3001/auth');



    static async updateProfile(userId:number, userData:UserProfileFormData){
        const response = await this.privateAxios.put(`/update_profile/${userId}`, userData);
        return 
    }

    static async getProfile(userId:number){
        const response = await this.privateAxios.get<UserProfileFormData>(`/get_profile/${userId}`,{withCredentials:true});
        return response.data;
    }

    static async logout(){
        const response = await this.privateAxios.post<boolean>(`/logout`,{withCredentials:true});
        return response.data;
    }
    


}
