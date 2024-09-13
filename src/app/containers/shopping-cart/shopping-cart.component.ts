import { Appearance, Location } from '@angular-material-extensions/google-maps-autocomplete';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressDeliveryModel } from 'src/app/models/addressDeliveryModel';
import { ClientDeliveryModel } from 'src/app/models/clientDeliveryModel';
import { EstablishmentModel } from 'src/app/models/establishment';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';
import { orderModel } from 'src/app/models/orderModel';
import { ProductItemModel } from 'src/app/models/producItemModel';
import { TypePaymentModel } from 'src/app/models/typePayment';
import { FirebaseEstablishmentService } from 'src/app/services/firebase-service-establishment/firebase-establishment.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import PlaceResult = google.maps.places.PlaceResult;
import LatLng = google.maps.LatLng;
import { ItemProductModel } from 'src/app/models/itemProduct';
import { OptionItemProduct } from 'src/app/models/optionItemProduct';
import { MenuModel } from 'src/app/models/menuModel';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutCartComponent } from '../checkout-cart/checkout-cart.component';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  public productItem: ProductItemModel[];
  public verifyExistProduct: boolean;
  public order: orderModel;
  public loading: any;
  // public formOrder: FormGroup;
  
  public valueAmount: number;
  public establishmentDelivery: EstablishmentModel;
  public neighborhoods: NeighborhoodModel[];
  public deliveryFee: number = 0;
  public date: any;

  public appearance = Appearance;
  public zoom: number;
  public latitude: number = 0;
  public longitude: number = 0;
  public selectedAddress: PlaceResult;
  public addressDelivery: AddressDeliveryModel;

  public street: string;
  public uf: string;
  public state: string;
  public city: string;
  public country: string;
  public district: string;
  public address: string | undefined;
  public rateService: number;

  public valueTotalWithoutFee: number;
  public addressValid: boolean = false;

  constructor(public dialog: MatDialog, private shoppingCartService: ShoppingCartService, private firebaseService: FirebaseEstablishmentService, private route: Router) { }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('user')!);
    var data  = JSON.parse(localStorage.getItem('completeUser')!);
    if(user != null && (data === null || data.displayName === null || data.displayName === '')) {
      this.route.navigate(['continue-signup']);
    }
    this.init();
  }

  init() {
    // this.buildFormOrder();
    this.productItem = this.shoppingCartService.getItems();
    if (this.productItem.length > 0) {
      this.verifyExistProduct = true;
      this.someAmount(this.productItem);
      this.loadEstablishment(this.productItem);
      // this.loadNeighborhoods(this.productItem);
    } else {
      this.verifyExistProduct = false;
    }
    this.address = 'R. Augusta - Consolação, São Paulo - SP';
  }

  onAutocompleteSelected(result: PlaceResult) {
    if (result && result.address_components && result.address_components.length > 0) {
      this.address = result.formatted_address;
      this.addressValid = true;
      result.address_components.forEach(element => {
        if (element.types[0] == 'route') {
          this.street = element.long_name;
        }
        if (element.types[0] == 'sublocality_level_1') {
          this.district = element.long_name;
        }
        if (element.types[0] == 'administrative_area_level_2') {
          this.city = element.long_name;
        }
        if (element.types[0] == 'administrative_area_level_1') {
          this.uf = element.short_name;
        }
        if (element.types[0] == 'administrative_area_level_1') {
          this.state = element.long_name;
        }
        if (element.types[0] == 'country') {
          this.country = element.long_name;
        }
      });
    }
  }

  onLocationSelected(location: Location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;

    this.getDistance(this.establishmentDelivery.latitude, this.establishmentDelivery.longitude, location.latitude, location.longitude);
  }

  loadEstablishment(productItem: ProductItemModel[]) {
    this.firebaseService.getId(productItem[0].idEstablishment).subscribe((response) => {
      this.establishmentDelivery = response as EstablishmentModel;
      this.calculateServiceValue(this.valueTotalWithoutFee, this.establishmentDelivery.feeProduct);

    });

  }

  someAmount(producItemModel: ProductItemModel[]) {
    let valueTotal = 0;
    const valueItens = this.someValueItens(producItemModel);
    producItemModel.forEach(element => {
      if (element.product.price > 0) {
        valueTotal = element.product.price * element.quantity + valueTotal;
      }
    });
    this.valueAmount = valueTotal + valueItens;
    this.valueTotalWithoutFee = valueTotal + valueItens;
  }

  someValueItens(producItemModel: ProductItemModel[]) {
    let valueItens = 0;
    let values: Array<number> = [];
    producItemModel.forEach(element => {
      element.product.itensProduct.forEach(element2 => {
        if (element2 && element2.priceOption && element2.quantity) {
          let someQuantity = element2.quantity * element2.priceOption;
          values.push(someQuantity)
        }

      });
    });
    const initialValue = 0;
    valueItens = values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );
    return valueItens;
  }

 

  calculateServiceValue(totalProdutosSemTaxaDelivery: number, impost: number) {
    this.rateService = totalProdutosSemTaxaDelivery / 100 * impost;
  }


  validPayment(typePayment: string, valueAmount: number, valueCash: number) {
    let valid: boolean = false;
    const avista = 'A VISTA (DINHEIRO)';
    if (typePayment !== avista) {
      valid = true;
      return valid;
    }
    if (typePayment === avista && valueAmount > valueCash) {
      valid = true;
      return valid;
    }
    if (typePayment === avista && valueAmount < valueCash) {
      valid = false;
      return valid;
    }

    return valid;
  }

  checkout(){
    if(this.addressValid) {
      this.addressDelivery = {
        street: this.street,
        neighborhood: this.district,
        city: this.city,
        state: this.state,
        country: this.country,
        latitude: this.latitude,
        longitude: this.longitude,
        typeAddress: 'ANY',
        address: this.address
      }
  
      this.order = {
          addressDelivery: this.addressDelivery,
          amount: this.valueAmount,
          assessment: 5,
          establishment: this.establishmentDelivery,
          grossValue: this.valueTotalWithoutFee,
          rebate: 0,
          productItem: this.productItem,
          statusPayment: 'PENDENTE',
          statusOrder: 'SOLICITADO',
          rateDelivery: this.deliveryFee,
          rateService: this.rateService,
          idEstablishment: this.establishmentDelivery.id,
          changeMoney: 0,
          valueCash: 0,
          dateCreated: new Date(),
          dateUpdated: new Date(),
          review: {rating: 0, observation: ''}
        }
  
  
      this.openDialog(this.order);
    } else {
      alert('Endereço inválido, selecione um endereço válido para sua entrega');
    }
    

  }
  

  openDialog(orderData:orderModel) {
    const dialogRef = this.dialog.open(CheckoutCartComponent, {
      width: '700px',
      data: orderData
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined) {
        this.sendOrder(result);
      }      
    });
  }

  // this.loading = true;
  // setTimeout(() => {
  //   this.sendOrder(this.order);
  // }, 3000);

  sendOrder(order: orderModel) {
    if (this.establishmentDelivery) {
      const user = JSON.parse(localStorage.getItem('user')!);
      if(user) {
        order.idClientDelivery = user?.uid;
      }      
      this.firebaseService.createOrder(order).then( (docRef) => {
        this.shoppingCartService.clearCart();
        localStorage.setItem('orderId', JSON.stringify(docRef.id));
      })
        .catch(function (error) {
        });

      this.loading = false;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { title: 'Pedido realizado com sucesso.', message: 'Status: ' + order.statusOrder }
      });
      dialogRef.afterClosed().subscribe(result => {
        
      });
      this.route.navigate(['/order-detail']);
    }
  }

  clearAddress() {
    this.address = '';
    this.changeAddress(); // Chamado para tratar mudanças no endereço
  }


  public getDistance(latOrigin: number, lngOrigin: number, latDest: number, lngDest: number) {
    const matrix = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
      matrix.getDistanceMatrix({
        origins: [new google.maps.LatLng(latOrigin, lngOrigin)],
        destinations: [new google.maps.LatLng(latDest, lngDest)],
        travelMode: google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        if (status === 'OK') {
          resolve(response)
          this.calculateDeliveryFee(response);
        } else {
          reject(response);
        }
      });
    })
  }

  calculateDeliveryFee(distance: google.maps.DistanceMatrixResponse) {
    const valueMultiple = this.establishmentDelivery.deliveryCostToKm;
    const valueFix = this.establishmentDelivery.initialDeliveryFee;
    const metrosDistance = distance.rows[0].elements[0].distance.value;
    const verifyCalcDistance = this.establishmentDelivery.addFromKm;
    if (metrosDistance >= verifyCalcDistance) {
      this.deliveryFee = Math.ceil((metrosDistance / 1000) * valueMultiple + valueFix);
      this.calculateValueTotal(Math.ceil(this.deliveryFee));
    } else {
      this.deliveryFee = valueFix;
      this.calculateValueTotal(Math.ceil(this.deliveryFee));0
    }
  }

  calculateValueTotal(valueDelivery:number){
    this.valueAmount = this.valueTotalWithoutFee + this.deliveryFee;
  }

  back() {
    localStorage.getItem('currentUrlName') ? this.route.navigate(['/' + localStorage.getItem('currentUrlName')]) : this.route.navigate(['/']);
  }



  deleteProductCart(item: ProductItemModel) {
    this.productItem.forEach(element => {
      if (element.product.id === item.product.id) {
        this.productItem.splice(this.productItem.indexOf(element), 1);
      }
    });


    this.shoppingCartService.deleteProduct(item);
    this.init();
  }

  deleteProductItem(item: OptionItemProduct, product: MenuModel) {
    this.productItem.forEach(element => {
      if (element.product.id === product.id) {
        element.product.itensProduct.forEach(element2 => {
          if (element2 && element2.id && element2.id === item.id) {
            element.product.itensProduct.splice(element.product.itensProduct.indexOf(element2), 1);
          }
        });
      }

    });
    // this.productItem.forEach(element => {
    //   if(element.product.id === product.id){
    //     element.product.itensProduct.splice(element.product.itensProduct.indexOf(item),1);
    //   }
    // });

    this.shoppingCartService.deleteProductItem(item, product);
    this.init();
  }

  changeAddress() {
    this.addressValid = false;
  }


  





}




