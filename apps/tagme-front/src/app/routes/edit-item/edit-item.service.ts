import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BFF_ROUTES } from '../../shared/service/bff-routes'
import { Item, ItemFormValue } from '../../shared/component/item-form/item-form.component'

type Result = Partial<{ ok: boolean, fail: boolean }>

@Injectable({ providedIn: 'root' })
export class EditItemService {
  constructor(private http: HttpClient) { }

  async updateItem(item: ItemFormValue, itemId: string): Promise<Result> {
    const formData = new FormData()
    formData.append('name', item.name)
    formData.append('description', item.description)

    if (item.image) {
      formData.append('image', item.image)
    }
    const response = await fetch(BFF_ROUTES.updateItem(itemId), {
      body: formData,
      method: 'PATCH'
    })

    return response.ok ? { ok: true } : { fail: true }
  }
  getItemById(id: string) {
    return this.http.get<Item>(BFF_ROUTES.findItemById(id))
  }
}
