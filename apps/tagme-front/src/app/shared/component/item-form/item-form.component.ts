import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MaterialFileInputModule } from 'ngx-material-file-input';

export interface ItemFormValue {
  image: File | null;
  name: string;
  description: string;
}
export type Item = {
  _id: string,
  name: string,
  description: string,
  imageUrl: string,
}

@Component({
  standalone: true,
  selector: 'app-item-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './item-form.component.html',
})
export class ItemFormComponent {
  @Input() initialValue?: Item;
  @Output() onSubmit = new EventEmitter<ItemFormValue>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      image: [null],
      name: ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
  }

  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.form.patchValue({ image: file });
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}

