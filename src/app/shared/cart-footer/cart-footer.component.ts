import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductItemModel } from 'src/app/models/producItemModel';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrls: ['./cart-footer.component.scss']
})
export class CartFooterComponent implements OnInit {
  cartItems: any[] = []; // Substitua por sua lógica real
  totalAmount: number = 0; // Substitua por sua lógica real
  public productItem: ProductItemModel[];
  public valueAmount: number;
  public valueTotalWithoutFee: number;
  public deliveryFee: number = 0;

  constructor(private shoppingCartService: ShoppingCartService, private router: Router) {}

  ngOnInit(): void {
    this.productItem = this.shoppingCartService.getItems();
  }

  someAmount(): number {
    const productItem = this.shoppingCartService.getItems();
    if(productItem.length > 0 ) {
        let valueTotal = 0;
    const valueItens = this.someValueItens(productItem);
    productItem.forEach(element => {
      if (element.product.price > 0) {
        valueTotal = element.product.price * element.quantity + valueTotal;
      }
    });
    this.valueAmount = valueTotal + valueItens;
    this.valueTotalWithoutFee = valueTotal + valueItens;
    return this.valueAmount;
    }
    return 0;    
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

  calculateValueTotal(valueDelivery:number){
    this.valueAmount = this.valueTotalWithoutFee + this.deliveryFee;
  }


  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const footer = document.querySelector('.footer-bar') as HTMLElement;
    if (window.scrollY < 20) { // Ajuste este valor conforme necessário
      footer?.classList.add('show');
    } else {
      footer?.classList.remove('show');
    }
  }

  goToCart() {
    this.router.navigate(['shopping-cart']);
  }
}
