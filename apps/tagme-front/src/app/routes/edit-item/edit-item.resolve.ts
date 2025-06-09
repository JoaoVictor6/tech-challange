import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Item } from '../../shared/component/item-form/item-form.component';
import { EditItemService } from './edit-item.service';

@Injectable({ providedIn: 'root' })
export class EditItemResolve implements Resolve<Item> {
  constructor(private editItemService: EditItemService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Item> {
    const id = route.paramMap.get('id');
    return this.editItemService.getItemById(id!);
  }
}

