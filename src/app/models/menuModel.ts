import { OptionItemProduct } from "./optionItemProduct";

export interface MenuModel {
    id:string;
    categoryMenu:string;
    idCategoryMenu:string;
    description:string;
    name:string;
    price:number;
    sideDish:string;
    statusActive?:boolean;
    urlImage:string;
    dateCreated?: Date;
    dateUpdate?: Date;
    idEstablishment:string;
    priceWithoutFee: number;
    hasItem?: boolean;
    sequence:number;
    itensProduct:OptionItemProduct[];
}
