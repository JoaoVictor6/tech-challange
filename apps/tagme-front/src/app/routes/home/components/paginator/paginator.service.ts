import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PaginatorService {
  constructor() { }

  getUrlPaginationInfos(params: Params) {
    const pageIndex = Number(params[ 'page' ]) || 1;
    const pageSize = Number(params[ 'pageSize' ]) || 10;
    const word = params[ 'word' ] || '';

    return { pageIndex, pageSize, word }
  }
}
