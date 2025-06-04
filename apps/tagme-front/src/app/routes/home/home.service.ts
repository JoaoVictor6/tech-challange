import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface users {
  name: string;
  description: string;
  id: string;
}
@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) { }

  async getUsers() {
    const USERS_DATA: users[] = [
      {
        name: "jogn",
        description: "testess",
        id: "assad"
      }
    ];
    await new Promise(r => setTimeout(r, 1000))
    return USERS_DATA
  }
}
