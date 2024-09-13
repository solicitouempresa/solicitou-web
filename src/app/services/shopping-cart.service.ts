import { Injectable } from '@angular/core';
import { MenuModel } from '../models/menuModel';
import { ProductItemModel } from '../models/producItemModel';
import { ItemProductModel } from '../models/itemProduct';
import { OptionItemProduct } from '../models/optionItemProduct';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  items: ProductItemModel[] = [];
  constructor(public dialog: MatDialog, private route:Router) { }


  addToCart(itemProduct: ProductItemModel) {
    const items = this.getItems();
    if(items.length > 0){
         let product = this.getItems();
          if(this.verifyEstablishment(itemProduct.idEstablishment, product)){
            this.items.push(itemProduct);
            return true;
          }else{
            return false;
          }
        
    } else {
        this.items.push(itemProduct);
        return true;
    }
  }


  getItems() {
    return this.items;
  }

  deleteProduct(item:ProductItemModel){
    this.items.forEach(element => {
      if(element.product.id === item.product.id){
        this.items.splice(this.items.indexOf(element),1);
      }
    });
  
  }

  deleteProductItem(item:OptionItemProduct, product:MenuModel){
    this.items.forEach(element => {
      if(element.product.id === product.id) {
        element.product.itensProduct.forEach(element2 => {
          if(element2 && element2.id && element2.id === item.id){
            element.product.itensProduct.splice(element.product.itensProduct.indexOf(element2), 1);
        }
        });
       }
    });
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

   verifyEstablishment(itemProducNew:string, product:ProductItemModel[]):boolean{
   const result = product.find(element => element.idEstablishment === itemProducNew);
    if(result){
      return true;
    } else{
      return false;
    }
  }

}
