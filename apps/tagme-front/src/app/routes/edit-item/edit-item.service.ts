import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BFF_ROUTES } from '../../shared/service/bff-routes'
import { Item } from '../../shared/component/item-form/item-form.component'

@Injectable({ providedIn: 'root' })
export class EditItemService {
  constructor(private http: HttpClient) { }

  getItemById(id: string) {
    return this.http.get<Item>(BFF_ROUTES.findItemById(id))
  }
}
