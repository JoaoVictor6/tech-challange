import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaginatorService } from '../paginator/paginator.service';

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
export class SearchInputComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private pagination = inject(PaginatorService)
  @Output() onSearch = new EventEmitter<string>();

  searchText = '';

  handleSearch() {
    this.onSearch.emit(this.searchText);
  }

  ngOnInit(): void {
    const { word } = this.pagination.getUrlPaginationInfos(this.route.snapshot.queryParams)
    if (word) {
      this.searchText = word
    }
  }
}
