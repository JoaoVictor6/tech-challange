import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HomeUserEditButton } from './components/home-user-edit-button/home-user-edit-button';
import { GetItemsResponse, Items } from './home.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationActions } from './stores/pagination/actions/pagination.actions';
import { paginationFeature } from './stores/pagination/reducers/pagination.reducer';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, map } from 'rxjs';
import { SearchInputComponent } from './components/search/search-input.component';

@Component({
  standalone: true,
  selector: 'home',
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, HomeUserEditButton, MatCardModule, PaginatorComponent, SearchInputComponent],
})
export class HomeComponent implements OnInit {
  private store = inject(Store)
  private route = inject(ActivatedRoute)

  displayedColumns: string[] = ['name', 'description', 'id'];
  dataSource: Items[] = [];
  totalPages = this.store.select(paginationFeature.selectTotalPages)
  pageIndex = this.store.select(paginationFeature.selectPageIndex)
  pageSize = this.store.select(paginationFeature.selectPageSize)
  vm$ = combineLatest([
    this.pageSize,
    this.pageIndex,
    this.totalPages
  ]).pipe(
    map(([pageSize, pageIndex, totalPages]) => {
      const totalItems = totalPages * pageSize
      return {
        totalItems,
        pageSize,
        pageIndex: pageIndex <= 0 ? 0 : pageIndex - 1,
        totalPages
      }
    })
  );

  onPaginatorChange = (event: PageEvent) => {
    location.replace(`/?page=${event.pageIndex + 1}&pageSize=${event.pageSize}`)
  }
  searchByText(event: any) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    const paginationFirstFetch = this.route.snapshot.data['home'] as GetItemsResponse
    const pageIndex = Number(queryParams['page']) || 0;
    const pageSize = Number(queryParams['pageSize']) || 10;
    this.store.dispatch(PaginationActions.changePage({ pageIndex, pageSize, totalPages: paginationFirstFetch.totalPages }))
    this.dataSource = paginationFirstFetch.data
  }
}

