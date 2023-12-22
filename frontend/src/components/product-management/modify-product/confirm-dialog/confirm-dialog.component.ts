import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  // Close the dialog and send 'confirm' as the result
  confirmDelete(): void {
    this.dialogRef.close('confirm');
  }

  // Close the dialog without performing any action
  cancelDelete(): void {
    this.dialogRef.close('cancel');
  }
}
