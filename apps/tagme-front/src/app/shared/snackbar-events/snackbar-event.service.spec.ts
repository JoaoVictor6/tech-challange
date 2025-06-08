import { SnackbarEventService } from './snackbar-event.service';

describe('SnackbarEventService', () => {
  let service: SnackbarEventService;

  beforeEach(() => {
    service = new SnackbarEventService();
  });

  it('should emit success event', (done) => {
    service.events$.subscribe(event => {
      expect(event).toEqual({ type: 'success', message: 'OK!' });
      done();
    });

    service.success('OK!');
  });

  it('should emit error event', (done) => {
    service.events$.subscribe(event => {
      expect(event).toEqual({ type: 'error', message: 'Oops' });
      done();
    });

    service.error('Oops');
  });
});

