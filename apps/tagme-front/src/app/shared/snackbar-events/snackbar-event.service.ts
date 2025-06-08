// src/app/shared/snackbar-events/snackbar-event.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type SnackbarEventType = 'success' | 'error';

export interface SnackbarEvent {
  type: SnackbarEventType;
  message: string;
}

@Injectable()
export class SnackbarEventService {
  private eventSubject = new Subject<SnackbarEvent>();
  public events$ = this.eventSubject.asObservable();

  dispatch(event: SnackbarEvent) {
    this.eventSubject.next(event);
  }

  success(message: string) {
    this.dispatch({ type: 'success', message });
  }

  error(message: string) {
    this.dispatch({ type: 'error', message });
  }
}

