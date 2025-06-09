import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Item, ItemFormComponent, ItemFormValue } from '../../shared/component/item-form/item-form.component';

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
export class EditItemPageComponent {
  private route = inject(ActivatedRoute);
  item = this.route.snapshot.data['item'] as Item;

  handleSubmit(value: ItemFormValue) {
    console.log('Updated:', value);
    // atualizar item no backend
  }
}

