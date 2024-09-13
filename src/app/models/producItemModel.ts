import { MenuModel } from "./menuModel";
import { OptionItemProduct } from "./optionItemProduct";

export interface ProductItemModel {
  product:MenuModel;
  quantity:number;
  idEstablishment:string;
  description:string;
}
