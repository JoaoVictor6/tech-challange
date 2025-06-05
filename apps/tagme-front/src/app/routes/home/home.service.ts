import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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
  constructor(private http: HttpClient) { }

  async getItems(): Promise<GetItemsResponse> {
    const USERS_DATA: Items[] = [
      {
        name: "jogn",
        description: "testess",
        id: "assad"
      }
    ];
    await new Promise(r => setTimeout(r, 1000))
    return { data: USERS_DATA, page: 1, totalPages: 2 }
  }
}
