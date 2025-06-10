import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemFormComponent, ItemFormValue } from '../../shared/component/item-form/item-form.component';
import { NewItemService } from './new-item.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-new-item-page',
  imports: [CommonModule, ItemFormComponent],
  template: `
    <div class="page-container">
      <app-item-form (onSubmit)="handleSubmit($event)" />
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  ` ],
})
export class NewItemPageComponent {
  private _snackBar = inject(MatSnackBar);
  newItemService = inject(NewItemService)
  async handleSubmit(value: ItemFormValue) {
    const result = await this.newItemService.createItem(value)
    console.log(result)
    if (result.ok) this._snackBar.open('Item criado!')
    if (result.fail) this._snackBar.open('Ocorreu um erro ao criar o item!')
  }
}
