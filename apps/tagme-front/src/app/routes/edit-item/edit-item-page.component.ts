import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Item, ItemFormComponent, ItemFormValue } from '../../shared/component/item-form/item-form.component';
import { EditItemService } from './edit-item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BFF_ROUTES } from '../../shared/service/bff-routes';

@Component({
  standalone: true,
  selector: 'app-edit-item-page',
  imports: [CommonModule, ItemFormComponent],
  template: `
    <div class="page-container">
      <app-item-form
        [initialValue]="item"
        (onSubmit)="handleSubmit($event)"
      />
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  ` ],
})
export class EditItemPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  editItemService = inject(EditItemService)
  _snackBar = inject(MatSnackBar)
  item = this.route.snapshot.data['item'] as Item;

  async handleSubmit(value: ItemFormValue) {
    const result = await this.editItemService.updateItem(value, this.item._id)
    if (result.ok) this._snackBar.open('Item editado!')
    if (result.fail) this._snackBar.open('Ocorreu um erro ao editar o item!')
  }

  ngOnInit(): void {
    this.item = { ...this.item, imageUrl: BFF_ROUTES.getImage(this.item.imageUrl) }
  }
}

