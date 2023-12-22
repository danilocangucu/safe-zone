import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.scss']
})
export class ModifyProductComponent {
  productForm: FormGroup;
  selectedImage: any;

  constructor(
    public dialogRef: MatDialogRef<ModifyProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    // Initialize the form group with the existing product data
    this.productForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      price: [data.price, [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
      quantity: [data.quantity, [Validators.required, Validators.min(1)]],
      files: this.fb.array([this.fb.control(null)]),
    });
  }

  onSaveClick(event: any): void {
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
