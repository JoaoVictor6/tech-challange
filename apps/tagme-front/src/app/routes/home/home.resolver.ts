import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from "@angular/router";
import { GetItemsResponse, HomeService } from "./home.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<GetItemsResponse> {
  constructor(private homeService: HomeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GetItemsResponse | RedirectCommand> {
    const { pageSize, pageIndex } = this.homeService.getUrlPaginationInfos(route.queryParams)
    return this.homeService.getItems({ pageSize, pageIndex })
  }
}
