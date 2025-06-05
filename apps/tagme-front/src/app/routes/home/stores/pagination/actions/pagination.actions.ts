import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaginationState } from '../pagination.models';

export const PaginationActions = createActionGroup({
  source: 'Pagination',
  events: {
    'Change Page': props<Partial<PaginationState>>(),
    'Select state': emptyProps()
  }
});
