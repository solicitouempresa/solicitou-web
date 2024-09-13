import { OptionItemProduct } from "./optionItemProduct";
import { TypeProductItemModel } from "./typeProductItemModel";

export interface ItemProductModel {
    id?:string;
    name?:string;
    description?:string;
    dateCreated?:Date;
    dateUpdated?:Date;
    status?: boolean;
    required?:boolean;
    sequence?:number;
    type?:TypeProductItemModel;
    img?:string;
    quantityMax?:number;
    quantityMin?:number;
    quantityOptionMax?:number;
    quantityOptionMin?:number;
    optionsItens?:OptionItemProduct[];
    formVerify?:boolean;
}