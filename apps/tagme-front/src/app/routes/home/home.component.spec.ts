import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaginationActions } from './stores/pagination/actions/pagination.actions';
import { PaginatorService } from './components/paginator/paginator.service';
import { NavigationService } from '../../shared/service/navigation.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;
  let paginatorService: PaginatorService;
  let replaceSpy: jasmine.Spy;
  let navigationService: NavigationService;

  const defaultState = {
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      totalPages: 3,
    }
  };

  const mockActivatedRoute = {
    snapshot: {
      data: {
        home: {
          data: [ { name: 'Item', description: 'Desc', id: '1' } ],
          totalPages: 3,
        }
      },
      queryParams: {}
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: defaultState }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        PaginatorService
      ],
      imports: [ HomeComponent ]
    });

    store = TestBed.inject(MockStore);
    paginatorService = TestBed.inject(PaginatorService);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    navigationService = TestBed.inject(NavigationService);
    replaceSpy = spyOn(navigationService, 'redirectTo');
  });

  describe('ngOnInit()', () => {
    it('dispatches changePage with default values when queryParams are empty', () => {
      const dispatchSpy = spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaginationActions.changePage({
          pageIndex: 1,
          pageSize: 10,
          totalPages: 3
        })
      );
    });

    it('dispatches changePage with parsed queryParams', () => {
      mockActivatedRoute.snapshot.queryParams = { page: '5', pageSize: '25' };

      const dispatchSpy = spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaginationActions.changePage({
          pageIndex: 5,
          pageSize: 25,
          totalPages: 3
        })
      );
    });

    it('populates dataSource from resolver response', () => {
      component.ngOnInit();

      expect(component.dataSource).toEqual([
        { name: 'Item', description: 'Desc', id: '1' }
      ]);
    });
  });

  describe('onPaginatorChange()', () => {
    it('updates location with search param if present in queryParams', () => {
      mockActivatedRoute.snapshot.queryParams = {
        word: 'query'
      };

      component.onPaginatorChange({ pageIndex: 2, pageSize: 20 } as any);

      expect(replaceSpy).toHaveBeenCalledWith(
        '/?page=3&pageSize=20&word=query'
      );
    });

    it('updates location without search param when not present', () => {
      mockActivatedRoute.snapshot.queryParams = {};

      component.onPaginatorChange({ pageIndex: 1, pageSize: 5 } as any);

      expect(replaceSpy).toHaveBeenCalledWith('/?page=2&pageSize=5');
    });
  });

  describe('searchByText()', () => {
    it('calls getUrlPaginationInfos and updates location with search term', () => {
      spyOn(paginatorService, 'getUrlPaginationInfos').and.returnValue({
        pageIndex: 1,
        pageSize: 25,
        word: '1'
      });

      component.searchByText('banana');

      expect(replaceSpy).toHaveBeenCalledWith(
        '/?word=banana'
      );
    });

    it('searches with empty string', () => {
      spyOn(paginatorService, 'getUrlPaginationInfos').and.returnValue({
        pageIndex: 0,
        pageSize: 10,
        word: ''
      });

      component.searchByText('');

      expect(replaceSpy).not.toHaveBeenCalled();
    });
  });
});
