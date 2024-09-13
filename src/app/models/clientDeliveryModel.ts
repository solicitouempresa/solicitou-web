import { AddressDeliveryModel } from "./addressDeliveryModel";

export interface ClientDeliveryModel {
  name?:string;
  cpf?:number;
  age?:number;
  address?:AddressDeliveryModel[];
  email?:string;
  contact?:number;
  gender?:string;
  status?:string;
}
