// src/app/shared/snackbar-events/snackbar.service.ts
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarEventService } from './snackbar-event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class SnackbarService {
  private snackbar = inject(MatSnackBar);
  private snackbarEventService = inject(SnackbarEventService);

  constructor() {
    this.snackbarEventService.events$
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        switch (event.type) {
          case 'success':
            this.snackbar.open(event.message, 'OK', { duration: 3000, panelClass: 'snackbar-success' });
            break;
          case 'error':
            this.snackbar.open(event.message, 'Fechar', { duration: 5000, panelClass: 'snackbar-error' });
            break;
        }
      });
  }
}

