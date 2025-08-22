import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { buttonClick } from '@testing';

import { OperatorUserRegistrationDTO, OperatorUsersRegistrationService } from 'esos-api';

import { UserRegistrationStore } from '../store/user-registration.store';
import { SummaryComponent } from './summary.component';

const mockUserRegistrationDTO: OperatorUserRegistrationDTO = {
  firstName: 'John',
  lastName: 'Doe',
  jobTitle: 'job title',
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

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let store: UserRegistrationStore;
  let router: Router;
  let operatorUsersRegistrationService: OperatorUsersRegistrationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, PageHeadingComponent, RouterTestingModule],
      providers: [UserRegistrationStore],
    }).compileComponents();

    store = TestBed.inject(UserRegistrationStore);
    store.setState({ userRegistrationDTO: mockUserRegistrationDTO });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    operatorUsersRegistrationService = TestBed.inject(OperatorUsersRegistrationService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a new user with given data when not invited', () => {
    jest.spyOn(operatorUsersRegistrationService, 'registerCurrentOperatorUser').mockReturnValue(of(null));

    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

    buttonClick(fixture);

    expect(navigateSpy).toHaveBeenCalledWith(['../success'], { relativeTo: TestBed.inject(ActivatedRoute) });
    expect(operatorUsersRegistrationService.registerCurrentOperatorUser).toHaveBeenCalledWith(mockUserRegistrationDTO);
  });

  it('should accept invitation and register user with given data when invited', () => {
    store.setState({ userRegistrationDTO: mockUserRegistrationDTO });
    store.setState({ ...store.getState(), isInvited: true, token: 'token' });
    jest.spyOn(operatorUsersRegistrationService, 'acceptOperatorInvitationAndRegister').mockReturnValue(of(null));

    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

    buttonClick(fixture);

    expect(navigateSpy).toHaveBeenCalledWith(['../success'], { relativeTo: TestBed.inject(ActivatedRoute) });
    expect(operatorUsersRegistrationService.acceptOperatorInvitationAndRegister).toHaveBeenCalledWith({
      operatorUserRegistrationDTO: mockUserRegistrationDTO,
      invitationTokenDTO: { token: 'token' },
    });
  });
});
