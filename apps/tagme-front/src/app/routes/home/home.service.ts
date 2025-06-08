import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

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

  getItems({ pageSize, pageIndex }: { pageIndex: number, pageSize: number }): Observable<GetItemsResponse> {
    const url = new URL("http://localhost:3000/items")
    url.searchParams.set("page", String(pageIndex))
    url.searchParams.set("pageSize", String(pageSize))
    const response = this.http.get<GetItemsResponse>(url.toString()).pipe(
      catchError(err => throwError(() => new Error("Dados não encontrado")))
    )
    return response
  }
}
