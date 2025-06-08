import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './home-user-edit-dialog.component.html'
})
export class HomeUserEditDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: string },
    private dialogRef: MatDialogRef<HomeUserEditDialogComponent>
  ) { }

  edit() {
    this.dialogRef.close('edit');
  }

  remove() {
    this.dialogRef.close('remove');
  }
}
