import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  productForm: FormGroup;
  selectedImage: any;

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // Initialize the form group with form controls
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]], // Added a pattern validator for price
      quantity: ['', [Validators.required, Validators.min(1)]], // Added a minimum quantity validator
      files: this.fb.array([this.fb.control(null)]),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    } else {
      // Trigger validation for all form fields
      Object.keys(this.productForm.controls).forEach((field) => {
        const control = this.productForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  handleFileInput(event: any, index: number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      this.selectedImage = file;

      (this.productForm.get('files') as FormArray).at(index).patchValue(file);
    }
  }

  addFileInput(): void {
    if ((this.productForm.get('files') as FormArray).length < 5) {
      (this.productForm.get('files') as FormArray).push(this.fb.control(null));
    } else {
      alert(
        'You can upload a maximum of 5 images at a time. If you want to upload more, go to edit product afterwards.'
      );
    }
  }

  get filesArray(): FormArray {
    return this.productForm.get('files') as FormArray;
  }
}
