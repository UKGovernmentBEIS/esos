import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { OrganisationAccountApplicationSummaryPageComponent } from '@accounts/organisation-account-application/components';

import { OrganisationAccountOpeningSubmitApplicationCreateActionPayload, RequestsService } from 'esos-api';

import { OrganisationAccountOpeningApplicationState } from '../../+state/organisation-account.state';
import { OrganisationAccountStore } from '../../+state/organisation-account.store';

describe('OrganisationAccountApplicationSummaryPageComponent', () => {
  let component: OrganisationAccountApplicationSummaryPageComponent;
  let fixture: ComponentFixture<OrganisationAccountApplicationSummaryPageComponent>;
  let store: OrganisationAccountStore;
  let router: Router;
  let navigateSpy: jest.SpyInstance;
  let requestsService: RequestsService;
  let element: HTMLElement;

  const state: OrganisationAccountOpeningApplicationState = {
    registrationStatus: true,
    registrationNumber: '12345678',
    name: 'Test Organisation',
    address: {
      line1: '123 Main St',
      line2: 'Apt 4',
      city: 'city',
      county: 'West Sussex',
      postcode: '12345',
    },
    competentAuthority: 'ENGLAND',
    type: 'OTHER',
    otherTypeName: 'some classification name',
    codes: ['CodeA', 'CodeB', 'CodeC'],
  };
  const applicationPayload: OrganisationAccountOpeningSubmitApplicationCreateActionPayload = {
    payloadType: 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION_PAYLOAD',
    registrationNumber: '12345678',
    name: 'Test Organisation',
    competentAuthority: 'ENGLAND',
    line1: '123 Main St',
    line2: 'Apt 4',
    county: 'West Sussex',
    city: 'city',
    postcode: '12345',
    type: 'OTHER',
    otherTypeName: 'some classification name',
    codes: ['CodeA', 'CodeB', 'CodeC'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationAccountApplicationSummaryPageComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [OrganisationAccountStore, { provide: ActivatedRoute, useValue: { snapshot: {} } }],
    }).compileComponents();

    store = TestBed.inject(OrganisationAccountStore);
    store.setState(state);
    requestsService = TestBed.inject(RequestsService);
    fixture = TestBed.createComponent(OrganisationAccountApplicationSummaryPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //TODO to be revised

  it('should submit the participant application', fakeAsync(() => {
    const submitButton = element.querySelector<HTMLButtonElement>('button[title="Submit"]');
    expect(submitButton).not.toBeNull();
    const submitRequestSpy = jest.spyOn(requestsService, 'processRequestCreateAction').mockReturnValue(of(null));

    submitButton.click();
    tick();
    fixture.detectChanges();

    expect(submitRequestSpy).toHaveBeenCalledWith({
      requestCreateActionType: 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION',
      requestCreateActionPayload: applicationPayload,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['../submitted'], expect.anything());
  }));
});
