import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'home-user-edit-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './home-user-edit-button.html',
  styleUrl: './home-user-edit-button.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeUserEditButtonComponent {
  @Input() userId!: string;

  @Output() onEdit = new EventEmitter<string>();
  @Output() onRemove = new EventEmitter<string>();

  edit() {
    this.onEdit.emit(this.userId)
  }
  remove() {
    this.onRemove.emit(this.userId)
  }
}
