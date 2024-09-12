import { EstablishmentModel } from "./establishment";
import { GeolocationModel } from "./geolocation.model";

export interface EstablishmentGeopositioningModel {

    establishment:EstablishmentModel;
    distance:number;
    metric:string;
    pointReference:GeolocationModel;
    targetReference:GeolocationModel;
    hasLatLng:boolean;
}