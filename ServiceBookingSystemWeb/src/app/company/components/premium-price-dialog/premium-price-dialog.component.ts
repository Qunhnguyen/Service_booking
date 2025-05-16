import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-premium-price-dialog',
  templateUrl: './premium-price-dialog.component.html',
  styleUrls: ['./premium-price-dialog.component.scss']
})
export class PremiumPriceDialogComponent implements OnInit {
  priceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PremiumPriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.priceForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data.currentPrice) {
      this.priceForm.patchValue({
        price: this.data.currentPrice
      });
    }
  }

  onSubmit(): void {
    if (this.priceForm.valid) {
      this.dialogRef.close(this.priceForm.value.price);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 