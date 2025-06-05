import { createFeature, createReducer, on } from '@ngrx/store';
import { PaginationActions } from '../actions/pagination.actions';
import { PaginationState } from '../pagination.models';

export const paginationFeatureKey = 'pagination';

export const initialState: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
  totalPages: 0,
};

export const reducer = createReducer(
  initialState,
  on(PaginationActions.changePage, (state, props) => ({ ...state, ...props })),
  on(PaginationActions.selectState, (state) => state),
);

export const paginationFeature = createFeature({
  name: paginationFeatureKey,
  reducer,
});

