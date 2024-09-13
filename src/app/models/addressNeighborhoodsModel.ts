import { CityNeighborhoodsModel } from "./cityNeighborhoodsModel";

export interface AddressNeighborhoodsModel {
    id:number;
    state:string;
    city:CityNeighborhoodsModel[];
}