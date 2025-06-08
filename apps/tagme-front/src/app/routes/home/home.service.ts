import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { BFF_ROUTES } from '../../shared/service/bff-routes';

export type Items = {
  name: string;
  description: string;
  id: string;
}

export type GetItemsResponse = {
  data: Items[],
  page: number,
  totalPages: number
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  getItems({ pageSize, pageIndex, word }: { pageIndex: number, pageSize: number, word: string }): Observable<GetItemsResponse> {
    const url = new URL(BFF_ROUTES.findAllItems)
    url.searchParams.set('page', String(pageIndex))
    url.searchParams.set('pageSize', String(pageSize))
    if (word) {
      url.searchParams.set('word', word)
    }
    const response = this.http.get<GetItemsResponse>(url.toString()).pipe(
      catchError(err => throwError(() => new Error('Dados não encontrado')))
    )
    return response
  }
}
