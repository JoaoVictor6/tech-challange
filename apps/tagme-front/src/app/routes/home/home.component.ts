import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HomeUserEditButtonComponent } from './components/home-user-edit-button/home-user-edit-button';
import { GetItemsResponse, HomeService, Items } from './home.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { PaginationActions } from './stores/pagination/actions/pagination.actions';
import { paginationFeature } from './stores/pagination/reducers/pagination.reducer';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, map } from 'rxjs';
import { SearchInputComponent } from './components/search/search-input.component';
import { PaginatorService } from './components/paginator/paginator.service';
import { NavigationService } from '../../shared/service/navigation.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms))

@Component({
  standalone: true,
  selector: 'home',
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, HomeUserEditButtonComponent, MatCardModule, PaginatorComponent, SearchInputComponent, MatMenuModule,],
})
export class HomeComponent implements OnInit {
  private navigation = inject(NavigationService)
  private homeService = inject(HomeService)
  private store = inject(Store)
  private route = inject(ActivatedRoute)
  private paginatorService = inject(PaginatorService)
  private _snackBar = inject(MatSnackBar);

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
    const { word: persistedSearchQueryParam } = this.paginatorService.getUrlPaginationInfos(this.route.snapshot.queryParams)
    if (persistedSearchQueryParam) {
      return this.navigation.redirectTo(`/?page=${event.pageIndex + 1}&pageSize=${event.pageSize}&word=${persistedSearchQueryParam}`)
    }
    this.navigation.redirectTo(`/?page=${event.pageIndex + 1}&pageSize=${event.pageSize}`)
  }
  searchByText(word: string) {
    if (!word) return
    this.navigation.redirectTo(`/?word=${word}`)
  }
  onEditUser = (userId: string) => {
    this.navigation.redirectTo(`/item/${userId}`)
  }
  onRemoveUser = async (userId: string) => {
    const response = await this.homeService.deleteItem(userId)
    if (response.ok) {
      this._snackBar.open('Item apagado com sucesso')
    } else {
      this._snackBar.open('Erro ap apagar o item')
    }
    await sleep(1000)
    location.reload()
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    const paginationFirstFetch = this.route.snapshot.data['home'] as GetItemsResponse
    const { pageSize, pageIndex } = this.paginatorService.getUrlPaginationInfos(queryParams)
    this.store.dispatch(PaginationActions.changePage({ pageIndex, pageSize, totalPages: paginationFirstFetch.totalPages }))
    this.dataSource = paginationFirstFetch.data
  }
}

