import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { orderModel } from 'src/app/models/orderModel';

@Component({
  selector: 'order-specification-dialog',
  templateUrl: './order-specification-dialog.component.html',
  styleUrls: ['./order-specification-dialog.component.scss']
})
export class OrderSpecificationDialogComponent {

    public orderData:orderModel;

    constructor(
      public dialogRef: MatDialogRef<OrderSpecificationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { order: orderModel }
    ) {
      this.orderData = data.order;
    }

  onClose(): void {
    this.dialogRef.close();
  }
}