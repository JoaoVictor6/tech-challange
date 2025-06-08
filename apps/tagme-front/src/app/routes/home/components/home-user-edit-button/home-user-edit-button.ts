import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HomeUserEditDialogComponent } from './home-user-edit-dialog.component';

@Component({
  selector: 'home-user-edit-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home-user-edit-button.html'
})
export class HomeUserEditButtonComponent {
  @Input() userId!: string;
  @Output() onEdit = new EventEmitter<string>();
  @Output() onRemove = new EventEmitter<string>();

  private dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(HomeUserEditDialogComponent, {
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe((result: 'edit' | 'remove' | undefined) => {
      if (result === 'edit') this.onEdit.emit(this.userId);
      if (result === 'remove') this.onRemove.emit(this.userId);
    });
  }
}
