import { EstablishmentModel } from "./establishment";

export interface HeadquartersModel {
    id:number;
    name:string;
    statusActive:boolean;
    establishments:Array<EstablishmentModel>;
}