import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModel } from 'src/app/models/menuModel';
import { ProductItemModel } from 'src/app/models/producItemModel';
import { FirebaseEstablishmentService } from 'src/app/services/firebase-service-establishment/firebase-establishment.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Location } from '@angular/common';
import { OptionItemProduct } from 'src/app/models/optionItemProduct';
import { ItemProductModel } from 'src/app/models/itemProduct';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  public loading: any;
  public idEstablishment: any;
  public nameEstablishment: any;
  public idProduct: any;
  public product: MenuModel;
  public formCart: FormGroup;
  public productData:ProductItemModel;
  public optionItemProduct: OptionItemProduct[];
  public itemProduct: ItemProductModel[];
  public itemProductView: ItemProductModel[] = [];
  public itemQuantityTotal:number = 0;

  public itensProduct: OptionItemProduct[] = [];
  public quantityChoice: OptionItemProduct[] = [];

  optionChoice: OptionItemProduct;

  checkChoice:number;
  checkBoxsChoice: OptionItemProduct[] = [];

  establishmentIsOpen: boolean;

  quantity:number = 0;
  description: string;
  constructor(private firebaseEstablishmentService: FirebaseEstablishmentService, private route: ActivatedRoute, private routeNavigate: Router, private shoppingCartService: ShoppingCartService, private location: Location, private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.itemProductView = [];
    this.idEstablishment = this.route.snapshot.paramMap.get('idEstablishment');
    this.nameEstablishment = this.route.snapshot.paramMap.get('name');
    this.idProduct = this.route.snapshot.paramMap.get('idProduct');
    this.firebaseEstablishmentService.getName(this.slugToTitle(this.nameEstablishment)).then(
      result => {
        this.idEstablishment = result?.id;
        this.establishmentIsOpen = this.checkIfOpen(result.hours);
        this.firebaseEstablishmentService.getIdProduct(this.idEstablishment, this.idProduct).subscribe((resp) => {
          this.product = resp as MenuModel;
          this.loading = false;    
        });
        this.loadItemProduct();
      });   

    // this.formCart = new FormGroup({
    //   quantidade: new FormControl('', [Validators.required])
    // });

  }

  checkIfOpen(hours: any): boolean {
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

    if (hours[currentDay]) {
      const [open, close] = hours[currentDay].split('-').map((time: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      });
      return currentTime >= open && currentTime <= close;
    }

    return false; // Fechado se não houver horário para o dia atual
  }



  loadOptionItem(itemProduct:ItemProductModel){
    this.firebaseEstablishmentService.getAllOptionItemProduct(this.idEstablishment, this.idProduct, itemProduct.id as string).
    subscribe((response:OptionItemProduct[])=>{
    //  this.itemProductView = [];
     this.itemProduct.forEach(element => {
      if(element.id === itemProduct.id){
        element.optionsItens = response;
        if(!this.itemProductView.find(find => find.id == element.id)){
          this.itemProductView.push(element);
        };
      }
     });
    });
  }


  loadItemProduct(){
    this.firebaseEstablishmentService.getAllItemProduct(this.idEstablishment, this.idProduct).
    subscribe((response:ItemProductModel[]) => {
      this.itemProduct = response;
      this.itemProduct.forEach(element => {
        if(element.status){
          this.loadOptionItem(element);
        }
      });
    });
  }

  goToDetailProduct(id:number){
    this.routeNavigate.navigate(['detail-product/'+ id]);
  }

  disabledSubmitButton(): boolean {
    return this.quantity === 0 || this.quantity === null;
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  submit(){
    let formVerify = true;
    if(this.optionChoice){
      this.optionChoice.quantity = 1;
      this.itensProduct.push(this.optionChoice);
    }
    this.itemProductView.forEach(element => {
      if(element.formVerify && !element.formVerify) {
        formVerify = element.formVerify
        this.dialog.open(ConfirmationDialogComponent, {
          width: '300px',
          data: { title: 'Detalhe no produto', message: 'Preencha o item obrigatório: ' + element.name }
    
        });
      }
    });

    if(this.quantity <= 0){
      this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { title: 'Detalhe no produto', message: 'Preencha o campo quantidade!' }
  
      });
    }
    this.product.itensProduct = this.itensProduct;
    
    if(this.quantity > 0 && formVerify ){
        this.productData = {
        product : this.product,
        idEstablishment : this.idEstablishment,
        quantity:this.quantity,
        description: this.description ? this.description: ""
      }
      var cartReturn = this.shoppingCartService.addToCart(this.productData);
      if(!cartReturn) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '300px',
          data: { title: 'Carrinho.', message: 'Você possui produtos no carrinho de outro estabelecimento.'}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.routeNavigate.navigate(['/shopping-cart']);  
        });
      } else {        
        this.location.back();
      }
    }
    else {
      this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: { title: 'Detalhe no produto', message: 'Preencha os campos obrigatórios!'}
  
      });
    }

  }

  optionClick(item:OptionItemProduct, itemProduct?:ItemProductModel){
        itemProduct!.formVerify = true;
  }

  checkBoxUpdate(item:OptionItemProduct, event:any, itemProduct?:ItemProductModel){

    if(event){
      item.quantity = 1;
      this.checkBoxsChoice.push(item);
      this.itensProduct.push(item);
    } 
      if(!event || (itemProduct && itemProduct.quantityOptionMax && itemProduct.quantityOptionMax < this.checkBoxsChoice.length)){
       item.checked = false;
       const indice = this.itensProduct.indexOf(item);
       this.itensProduct.splice(indice, 1);
       this.checkBoxsChoice.splice(indice, 1);
      }

      if(itemProduct && itemProduct.required){
      if(itemProduct.quantityOptionMin && this.checkBoxsChoice.length >= itemProduct.quantityOptionMin){
        itemProduct.formVerify = true;         
      } 
      else {
        itemProduct!.formVerify = false;         
      }
    } else {
      itemProduct!.formVerify = true;         
    }
  }

   clickAdd(item:OptionItemProduct, itemProduct:ItemProductModel){
    if(itemProduct?.quantityMax! > this.itemQuantityTotal){
      this.itemQuantityTotal = this.itemQuantityTotal + 1;
      item.quantity = item.quantity! + 1;
      if(item.quantity <=  1){
        this.itensProduct.push(item);
        this.quantityChoice.push(item);
      }

    }

    if(itemProduct && itemProduct.required){

      if(itemProduct.quantityMin && this.quantityChoice.length >= itemProduct.quantityMin ){
         itemProduct.formVerify = true;         
      } 
      else {
        itemProduct!.formVerify = false;         
      }
    } else {
      itemProduct!.formVerify = true;         
    }

    // if(itemProduct?.quantityMin!){

 
  }

  clickRemove(item:OptionItemProduct, itemProduct:ItemProductModel){

    if(item.quantity! > 0 ){
      this.itemQuantityTotal = this.itemQuantityTotal - 1;
      item.quantity = item.quantity! - 1;
      this.itensProduct.splice(this.itensProduct.findIndex(find => {
        find.id === item.id
      }), 1);

      this.quantityChoice.splice(this.itensProduct.findIndex(find => {
        find.id === item.id
      }), 1);

    }

    if(itemProduct && itemProduct.required){
      if(this.quantityChoice.length >= itemProduct.quantityMin! ){
         itemProduct.formVerify = true;         
      } 
      else {
        itemProduct!.formVerify = false;         
      }
    } else {
      itemProduct!.formVerify = true;         
    }
    
  }

  slugToTitle(slug: string): string {
    const lowerCaseWords = new Set(['da', 'do', 'de', 'a', 'o', 'e', 'para', 'com', 'em']);

    // Função para adicionar acentos de volta
    const addAccents = (str: string) => str
      .replace(/a/g, 'á')                         // Simplesmente adicionando acento para exemplo, ajuste conforme necessário
      .replace(/e/g, 'é')
      .replace(/i/g, 'í')
      .replace(/o/g, 'ó')
      .replace(/u/g, 'ú');
  
    return slug
      .split('-')                               // Divide o slug em palavras
      .map(word => lowerCaseWords.has(word) ? word : this.capitalize(word)) // Capitaliza palavras conforme necessário
      .join(' ');      
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  back(){
    this.routeNavigate.navigate(['/'+ this.nameEstablishment]);
  }
}
