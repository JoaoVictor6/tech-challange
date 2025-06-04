import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserEditButton } from './home-user-edit-button';

describe('HomeUserEditButton', () => {
  let component: HomeUserEditButton;
  let fixture: ComponentFixture<HomeUserEditButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUserEditButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeUserEditButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
