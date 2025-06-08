import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarEventService } from './snackbar-event.service';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let snackbar: jasmine.SpyObj<MatSnackBar>;
  let eventService: SnackbarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        SnackbarEventService,
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('MatSnackBar', ['open'])
        }
      ]
    });

    snackbar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    eventService = TestBed.inject(SnackbarEventService);
    TestBed.inject(SnackbarService); // triggers subscription
  });

  it('should show success snackbar', () => {
    eventService.success('Yay!');
    expect(snackbar.open).toHaveBeenCalledWith('Yay!', 'OK', jasmine.any(Object));
  });

  it('should show error snackbar', () => {
    eventService.error('Fail!');
    expect(snackbar.open).toHaveBeenCalledWith('Fail!', 'Fechar', jasmine.any(Object));
  });
});
