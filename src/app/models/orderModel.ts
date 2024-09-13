import { AddressDeliveryModel } from "./addressDeliveryModel";
import { ClientDeliveryModel } from "./clientDeliveryModel";
import { EstablishmentModel } from "./establishment";
import { ItemProductModel } from "./itemProduct";
import { ProductItemModel } from "./producItemModel";
import { ReviewModel } from "./review";

export interface orderModel {
  id?:number
  productItem?:ProductItemModel[];
  dateCreated?:Date;
  dateUpdated?:Date;
  establishment?:EstablishmentModel;
  typePayment?: string; // tipo de pagamento
  addressDelivery?:AddressDeliveryModel;
  statusPayment?:string; // status do pagamento
  statusOrder?:string; // status do pedido
  rateDelivery?:number; // taxa delivery
  rateService?:number; // taxa serviço
  assessment?:number; //avaliação do pedido
  clientDelivery?:ClientDeliveryModel;
  grossValue?:number; //valor bruto
  rebate?:number; //desconto
  amount?:number; //valor total
  idEstablishment?:string;
  idClientDelivery?:string;
  statusDateCancel?: Date;
  statusDateAccept?: Date;
  statusDateDelivering?: Date;
  statusDateDelivered?: Date;
  statusDateFinalized?: Date;
  changeMoney?:number; //troco
  valueCash?:number; //valor que vai pagar a vista
  review: ReviewModel;
}
