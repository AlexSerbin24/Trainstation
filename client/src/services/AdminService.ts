
import createAxiosInstance from "../api/authAxios.ts";
import Train from "../types/train.ts";
import { TrainCreate, TrainDataForCreaionOrUpdate, TrainUpdate } from "../types/trainCreate.ts";


export default class AdminService {

    private static privateAxios = createAxiosInstance('http://localhost:3001/train');


    static async getTrains() {
        const response = await this.privateAxios.get<Train>('/all');
        return response.data;
    }

    static async getTrainForUpdate(trainId: number) {
        const response = await  this.privateAxios.get<TrainDataForCreaionOrUpdate>(`update/${trainId}`);
        return response.data;
    }

    static async createTrain(trainCreate:TrainCreate){
        const response = await this.privateAxios.post<Train>("/create", trainCreate);
        return response.data;
    }

    static async updateTrain(trainId:number, trainUpdate:TrainUpdate){
        const response =await this.privateAxios.put<Train>(`/${trainId}`, trainUpdate);
        return response.data;
    }

}
