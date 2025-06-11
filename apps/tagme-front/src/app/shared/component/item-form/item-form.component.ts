import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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

  private static cropImageToSquare(file: File): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const size = Math.min(img.width, img.height);
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, size, size, 0, 0, size, size);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: blob.type }));
            }
          }, file.type);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

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

  async submit() {
    if (!this.form.valid) return;

    const rawValue: ItemFormValue = this.form.value;

    if (rawValue.image) {
      return this.onSubmit.emit({ ...rawValue, image: await ItemFormComponent.cropImageToSquare(rawValue.image) })
    }
    this.onSubmit.emit(rawValue);
  }
}

