import { Injectable } from '@angular/core'
import { BFF_ROUTES } from '../../shared/service/bff-routes'
import { ItemFormValue } from '../../shared/component/item-form/item-form.component'

type Result = Partial<{ ok: boolean, fail: boolean }>

@Injectable({ providedIn: 'root' })
export class NewItemService {
  constructor() { }

  async createItem(item: ItemFormValue): Promise<Result> {
    const formData = new FormData()
    formData.append('name', item.name)
    formData.append('description', item.description)

    if (item.image) {
      formData.append('image', item.image)
    }
    const response = await fetch(BFF_ROUTES.createItem, {
      body: formData,
      method: 'POST'
    })

    return response.ok ? { ok: true } : { fail: true }
  }
}
