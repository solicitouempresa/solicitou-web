import { EstablishmentGeopositioningModel } from "./establishmentGeopositioning.model";
import { EstablishmentHoursModel } from "./establishmentHours";
import { ReviewModel } from "./review";

export interface EstablishmentModel {
  id: string;
  city: string;
  country: string;
  district: string;
  idCategoryEstablishment: number;
  idTypeRestaurant: number;
  name: string;
  number: number;
  urlName:string;
  complement?:string;
  reference?:string;
  state: string;
  statusActive?: boolean;
  street: string;
  categoryEstablishment: string;
  typeRestaurant: string;
  uf: string;
  urlImage: string;
  zipcode: number;
  dateCreated?: Date;
  dateUpdate?: Date;
  cnpj: number;
  pixNumber:string;
  pixName:string;
  pixType:string;
  ddd:number;
  numberContact:number;
  numberWhatsapp:number;
  numberTelegram:number;
  deliveryOpen?:boolean;
  open?:boolean;
  deliveryCostToKm:number;
  latitude:number;
  longitude:number;
  login:string,
  password:string,
  email?:string,
  address:string,
  typeEstablishment:string,
  feeProduct:number; // taxa por produto
  initialDeliveryFee: number; // taxa inicial delivery
  addFromKm:number; // iniciar calculo a partir de KM
  rating:number;
  hours: EstablishmentHoursModel;
  distance?:EstablishmentGeopositioningModel;
  review: ReviewModel[];
}
