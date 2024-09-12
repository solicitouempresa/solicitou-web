export interface AddressDeliveryModel {
  address?:string;
  street:string;
  number?:number;
  complement?:string;
  reference?:string;
  neighborhood:string;
  city:string;
  state:string;
  country:string;
  latitude:number;
  longitude:number;
  typeAddress?:string;
}
