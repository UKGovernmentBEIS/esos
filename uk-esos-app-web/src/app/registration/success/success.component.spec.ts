import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@shared/shared.module';

import { OperatorUserRegistrationDTO } from 'esos-api';

import { UserRegistrationStore } from '../store/user-registration.store';
import { SuccessComponent } from './success.component';

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;
  let store: UserRegistrationStore;

  const mockUserOperatorDTO: OperatorUserRegistrationDTO = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Job',
    address: {
      line1: 'Line 1',
      city: 'City',
      county: 'County',
      postcode: 'PostCode',
    },
    phoneNumber: {
      countryCode: 'UK44',
      number: '123',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessComponent],
      imports: [SharedModule, RouterTestingModule],
    }).compileComponents();

    store = TestBed.inject(UserRegistrationStore);

    store.setState({
      userRegistrationDTO: mockUserOperatorDTO,
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispay invited info if invited', () => {
    store.setState({
      ...store.getValue(),
      isInvited: true,
    });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'Your ESOS user account can now be activated by another Advanced User in the organisation account to which you have been invited. If this is not possible, contact your Regulator.',
    );
  });

  it('should dispay invited info if non invited', () => {
    store.setState({
      ...store.getValue(),
      isInvited: false,
    });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'You can now apply to create a new organisation account so you can start your ESOS reporting.',
    );
  });
});
