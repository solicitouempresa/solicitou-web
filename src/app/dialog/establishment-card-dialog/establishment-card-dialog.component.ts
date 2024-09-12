import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstablishmentModel } from 'src/app/models/establishment';
import { orderModel } from 'src/app/models/orderModel';

@Component({
  selector: 'order-specification-dialog',
  templateUrl: './establishment-card-dialog.component.html',
  styleUrls: ['./establishment-card-dialog.component.scss']
})
export class EstablishmentCardDialogComponent {

    public establishment:EstablishmentModel;
    operationHours: string;

    constructor(
      public dialogRef: MatDialogRef<EstablishmentCardDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { establishment: EstablishmentModel }
    ) {
      this.establishment = data.establishment;
      this.operationHours = this.establishment.hours ? this.getHours(this.establishment.hours) : '';
    }

    getHours(hours: any): string {
      const currentDate = new Date();
      const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
      return hours[currentDay];
    }

  onClose(): void {
    this.dialogRef.close();
  }
}