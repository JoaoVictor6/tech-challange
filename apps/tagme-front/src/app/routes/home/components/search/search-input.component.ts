import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-search-input',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './search-input.component.html',
  styleUrls: [ './search-input.component.css' ]
})
export class SearchInputComponent {
  @Output() onSearch = new EventEmitter<string>();

  searchText = '';

  handleSearch() {
    this.onSearch.emit(this.searchText);
  }
}
