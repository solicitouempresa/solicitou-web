import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddressDeliveryModel } from 'src/app/models/addressDeliveryModel';
import { ClientDeliveryModel } from 'src/app/models/clientDeliveryModel';
import { orderModel } from 'src/app/models/orderModel';
import { TypePaymentModel } from 'src/app/models/typePayment';

@Component({
  selector: 'app-checkout-cart',
  templateUrl: './checkout-cart.component.html',
  styleUrls: ['./checkout-cart.component.scss']
})
export class CheckoutCartComponent implements OnInit {
  public formOrder: FormGroup;
  public typePayment: TypePaymentModel[] = [
    { id: 1, description: 'PIX', status: true },
    { id: 2, description: 'A VISTA (DINHEIRO)', status: true },
    { id: 3, description: 'DÉBITO', status: true },
    { id: 4, description: 'CRÉDITO', status: true },
    { id: 5, description: 'VOUCHER (REFEIÇÃO)', status: true }
  ];
  public addressValid: boolean = true;
  public addressDelivery: AddressDeliveryModel;
  public date: any;
  public clientDelivery: ClientDeliveryModel;
  public order: orderModel;
  public loading: any;

  
  constructor(
    public dialogRef: MatDialogRef<CheckoutCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: orderModel) { }

  ngOnInit(): void {
    this.buildFormOrder();
    this.updateAdressFormData();
  }

  buildFormOrder() {
    this.formOrder = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      ddd: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      contact: new FormControl('', [Validators.required, Validators.minLength(8)]),
      street: new FormControl('', Validators.required),
      neighborhood: new FormControl('', Validators.required),
      number: new FormControl('', [Validators.required]),
      complement: new FormControl(''),
      reference: new FormControl(''),
      typePayment: new FormControl('', [Validators.required]),
      changeMoney: new FormControl({ value: 0, disabled: true }, Validators.required)
    });
  }

  
  calculateChangeMoney(valueCash: number, valueAmount: number) {
    let changeMoney = 0;
    const avista = 'A VISTA (DINHEIRO)';
    if (this.formOrder.get('typePayment')?.value == avista && valueCash > valueAmount) {
      changeMoney = valueCash - valueAmount;
    }
    return changeMoney;
  }

  updateAdressFormData(): void {
    var data  = JSON.parse(localStorage.getItem('completeUser')!);
    if(data) {
      this.formOrder.controls['name'].patchValue(data?.displayName);
      data?.displayName != null ?  this.formOrder.controls['name'].disable() : null;
      this.formOrder.controls['email'].patchValue(data?.email);
      data?.email != null ?  this.formOrder.controls['email'].disable() : null;
      this.formOrder.controls['ddd'].patchValue(data?.ddd);
      data?.ddd != null ?  this.formOrder.controls['ddd'].disable() : null;
      this.formOrder.controls['contact'].patchValue(data?.phone);
      data?.phone != null ?  this.formOrder.controls['contact'].disable() : null;
    }

    this.formOrder.controls['street'].patchValue(this?.data?.addressDelivery?.street);
    this?.data?.addressDelivery?.street != null ?  this.formOrder.controls['street'].disable() : null;

    this.formOrder.controls['neighborhood'].patchValue(this?.data?.addressDelivery?.neighborhood);
    this?.data?.addressDelivery?.neighborhood != null ?  this.formOrder.controls['neighborhood'].disable() : null;

    this.formOrder.controls['number'].patchValue(this?.data?.addressDelivery?.number);
    this?.data?.addressDelivery?.number != null ?  this.formOrder.controls['number'].disable() : null;
  }

  submit() {
    this.date = Date.now();
    // const changeMoney = this.calculateChangeMoney(this.formOrder.get('changeMoney')?.value, this.valueAmount);
    // quantity:this.formCart.get('quantidade')?.value
 
    if (this.formOrder.valid && this.addressValid) {

      this.addressDelivery = {
        street: String(this.data.addressDelivery?.street),
        number: this.formOrder.get('number')?.value,
        complement: this.formOrder.get('complement')?.value,
        reference: this.formOrder.get('reference')?.value,
        neighborhood: String(this.data.addressDelivery?.neighborhood),
        city: String(this.data.addressDelivery?.city),
        state: String(this.data.addressDelivery?.state),
        country: String(this.data.addressDelivery?.country),
        latitude: Number(this.data?.addressDelivery?.latitude),
        longitude: Number(this.data.addressDelivery?.longitude),
        typeAddress: this.data.addressDelivery?.typeAddress,
        address: this.data.addressDelivery?.address
      }

      this.clientDelivery = {
        contact: this.formOrder.get('ddd')?.value + this.formOrder.get('contact')?.value,
        name: this.formOrder.get('name')?.value,
        email: this.formOrder.get('email')?.value,
      }

      // this.order = {
      //   addressDelivery: this.addressDelivery,
      //   amount: this.valueAmount,
      //   assessment: 5,
      //   clientDelivery: this.clientDelivery,
      //   dateCreated: this.date,
      //   establishment: this.establishmentDelivery,
      //   grossValue: this.valueTotalWithoutFee,
      //   rebate: 0,
      //   productItem: this.productItem,
      //   typePayment: this.formOrder.get('typePayment')?.value,
      //   statusPayment: 'PENDENTE',
      //   statusOrder: 'SOLICITADO',
      //   rateDelivery: this.deliveryFee,
      //   rateService: this.rateService,
      //   idEstablishment: this.establishmentDelivery.id,
      //   changeMoney: 0,
      //   valueCash: 0
      // }
      this.data.addressDelivery = this.addressDelivery;
      this.data.clientDelivery = this.clientDelivery;
      this.dialogRef.close(this.data);
    }
    else if (!this.addressValid) {
      console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
      alert('Endereço não encontrado, Selecione um Endereço Corretamente.')
    } 
  }

  changePayment(event: any) {
    if (event.value === 'A VISTA (DINHEIRO)') {
      this.formOrder.get('changeMoney')?.enable();
    } else {
      this.formOrder.get('changeMoney')?.disable();
      this.formOrder.patchValue({
        changeMoney: 0
      });
    }
  }

  changeAddress() {
    this.addressValid = false;
  }

}
