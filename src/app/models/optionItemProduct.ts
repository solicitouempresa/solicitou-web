import { TypeProductItemModel } from "./typeProductItemModel";

export interface OptionItemProduct  {
    id?:string;
    name?:string;
    description?:string;
    priceOption?:number;
    sequence?:number;
    dateCreated?:Date;
    dateUpdated?:Date;
    status?: boolean;
    type?:TypeProductItemModel;
    img?:string;
    quantity?:number;
    checked ?: boolean;
}
