import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { OrderSpecificationDialogComponent } from 'src/app/dialog/order-specification-dialog/order-specification-dialog.component';
import { EstablishmentModel } from 'src/app/models/establishment';
import { orderModel } from 'src/app/models/orderModel';
import { FirebaseEstablishmentService } from 'src/app/services/firebase-service-establishment/firebase-establishment.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit {
  public orderData:orderModel;
  public establishment: EstablishmentModel;
  public orderDataByUser: orderModel[] = [];
  public verifyOrders:boolean = false;
  public orderId: any;
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  observation: string = '';

  constructor(public dialog: MatDialog, private route:Router, private firebaseService: FirebaseEstablishmentService) {
    this.orderId = localStorage.getItem('orderId');
  }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('user')!);
    var data  = JSON.parse(localStorage.getItem('completeUser')!);
    if(user != null && (data === null || data.displayName === null || data.displayName === '')) {
      this.route.navigate(['continue-signup']);
    }
    if(localStorage.getItem('orderId') && localStorage.getItem('orderId') !== undefined && localStorage.getItem('orderId') !== null ){
      this.loadOrderData(JSON.parse(this.orderId));
    } else if (user) {
      this.firebaseService.getAllOrdersByUserId(user?.uid).subscribe((response) => {
        this.orderDataByUser = response as orderModel[];
        console.log('teste: ' + JSON.stringify(this.orderDataByUser));
  
        this.orderDataByUser.forEach(order => {
          if (order.dateCreated instanceof Timestamp) {
            order.dateCreated = this.convertTimestampToDate(order.dateCreated);
          }
        });
        this.orderDataByUser.sort((a, b) => {
          const dateA = this.ensureDate(a.dateCreated);
          const dateB = this.ensureDate(b.dateCreated);
          return dateB.getTime() - dateA.getTime();
        });
        this.orderDataByUser = this.orderDataByUser.slice(0, 5);  
        this.verifyOrders = response.length > 0;
        this.initializeReviews();
      });
    }
    else {
      this.verifyOrders = false;
    }

  }

  loadOrderData(orderId:any){
    const user = JSON.parse(localStorage.getItem('user')!);
    if(user) {
      this.firebaseService.getAllOrdersByUserId(user?.uid).subscribe((response) => {
        this.orderDataByUser = response as orderModel[];
        console.log('teste: ' + JSON.stringify(this.orderDataByUser));
  
        this.orderDataByUser.forEach(order => {
          if (order.dateCreated instanceof Timestamp) {
            order.dateCreated = this.convertTimestampToDate(order.dateCreated);
          }
        });
        this.orderDataByUser.sort((a, b) => {
          const dateA = this.ensureDate(a.dateCreated);
          const dateB = this.ensureDate(b.dateCreated);
          return dateB.getTime() - dateA.getTime();
        });
        this.orderDataByUser = this.orderDataByUser.slice(0, 5);  
        this.verifyOrders = response.length > 0;
        this.initializeReviews();
      });
    } else {
      this.firebaseService.getIdOrder(orderId).subscribe((response) =>{
        this.orderData = response as orderModel;
        this.verifyOrders = true;
      });
    }
  }

  convertTimestampToDate(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }

  isStatusAfter(currentStatus: string, orderStatus?: string): boolean {
    if (!orderStatus) {
      return false;
    }
    const statusOrder = [
      'SOLICITADO',
      'PEDIDO CONFIRMADO',
      'PREPARANDO PEDIDO',
      'ENTREGANDO',
      'ENTREGUE'
    ];
    const currentIndex = statusOrder.indexOf(orderStatus);
    const statusIndex = statusOrder.indexOf(currentStatus);
    return currentIndex > statusIndex;
  }
  
  isOnlyStatusAfter(status: string): boolean {
    const statusOrder = [
      'SOLICITADO',
      'PEDIDO CONFIRMADO',
      'PREPARANDO PEDIDO',
      'ENTREGANDO',
      'ENTREGUE'
    ];
    const currentIndex = statusOrder.indexOf(this.orderData.statusOrder!);
    const statusIndex = statusOrder.indexOf(status);
    return currentIndex > statusIndex;
  }

  initializeReviews(): void {
    this.orderDataByUser.forEach(order => {
      if (!order.review) {
        order.review = { rating: 0, observation: '' };
      }
    });
  }


  toSpecification(order: orderModel) {
    const dialogRef = this.dialog.open(OrderSpecificationDialogComponent, {
      width: '750px',
      data: { order: order }
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  selectRating(star: number): void {
    this.rating = star;
  }

  submitReview(order: orderModel): void {
    const review = {
      rating: this.rating,
      observation: this.observation
    };
    order.review = review;    

    // Simula o envio da avaliação
    console.log('Avaliação enviada:', order);

    // Reseta os campos após o envio
    this.firebaseService.updateOrder(order, '');
    if (order.establishment) {
      if (!order.establishment.review) {
        order.establishment.review = [];
      }
      order.establishment.review.push(review);
      
      this.establishment = order.establishment;
      this.firebaseService.updateEstablishment(this.establishment);
      
      // Resetar os valores após enviar a avaliação
      this.rating = 0;
      this.observation = '';
    } else {
      console.error('Establishment is undefined or null.');
    }
    this.rating = 0;
      this.observation = '';
  }
  
  ensureDate(value: any): Date {
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    } else if (typeof value === 'number' && !isNaN(value)) {
      return new Date(value);
    } else if (value && value.toDate) {
      return value.toDate();
    } else if (value === undefined || value === null) {
      console.error('Date value is undefined or null:', value);
      return new Date(0); // Valor padrão para evitar falhas, ajustado para uma data inicial
    } else {
      console.error('Invalid date value:', value);
      return new Date(0); // Valor padrão para evitar falhas, ajustado para uma data inicial
    }
  }

  back(){
    localStorage.getItem('currentUrlName') ? this.route.navigate(['/' + localStorage.getItem('currentUrlName')]) : this.route.navigate(['/']);
   }

}
