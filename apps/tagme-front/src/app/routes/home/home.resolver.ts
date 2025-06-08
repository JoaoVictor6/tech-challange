import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { GetItemsResponse, HomeService } from './home.service';
import { Injectable } from '@angular/core';
import { PaginatorService } from './components/paginator/paginator.service';

@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<GetItemsResponse> {
  constructor(private paginatorService: PaginatorService, private homeService: HomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GetItemsResponse | RedirectCommand> {
    const { pageSize, pageIndex } = this.paginatorService.getUrlPaginationInfos(route.queryParams)
    return this.homeService.getItems({ pageSize, pageIndex })
  }
}
