import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemFormComponent, ItemFormValue } from '../../shared/component/item-form/item-form.component';

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
  handleSubmit(value: ItemFormValue) {
    console.log('Submitted:', value);
    // salvar item no backend
  }
}
