import axios from "axios";
import TrainsFilter from "../types/trainsFilters";


export default class TrainService {
    private static baseUrl = 'http://localhost:3001/train'



    static async getTrainById(id:string, route:{departurePoint:string, arrivalPoint:string} ){
        return (await axios.get(`${this.baseUrl}/${id}`,{
            params: route,
            paramsSerializer: params => {
              return new URLSearchParams(params).toString();
            }
          })).data;
    }
    static async searchTrains(trainsFilter: TrainsFilter) {
        
        const response = await axios.get(`${this.baseUrl}/search`, {
            params: trainsFilter,
            paramsSerializer: params => {
              return new URLSearchParams(params).toString();
            }
          });

          return response.data
    }



    static async getStations(){
        return (await axios.get(`${this.baseUrl}/stations`)).data;
    }
}

