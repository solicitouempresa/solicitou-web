import { NeighborhoodsDataModel } from "./neighborhoodsDataModel";

export interface CityNeighborhoodsModel {
    id:number,
    name:string,
    neighborhood:NeighborhoodsDataModel[];
}