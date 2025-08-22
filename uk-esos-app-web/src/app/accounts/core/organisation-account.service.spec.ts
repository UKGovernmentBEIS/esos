import { TestBed } from '@angular/core/testing';

import { OrganisationAccountStore } from '@accounts/organisation-account-application/+state';
import { OrganisationAccountOpeningApplicationState } from '@accounts/organisation-account-application/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';

import { RequestsService } from 'esos-api';

import { OrganisationAccountService } from './organisation-account.service';

describe('OrganisationAccountService', () => {
  let service: OrganisationAccountService;
  let requestsServiceMock: any;
  let businessErrorServiceMock: any;
  let pendingRequestServiceMock: any;
  let storeMock: any;

  beforeEach(() => {
    requestsServiceMock = {
      processRequestCreateAction: jest.fn(),
    };
    businessErrorServiceMock = {
      showErrorForceNavigation: jest.fn(),
    };
    pendingRequestServiceMock = {
      trackRequest: jest.fn(() => (source$) => source$),
    };
    storeMock = {
      state: {
        // Mock state object
      },
    };

    TestBed.configureTestingModule({
      providers: [
        OrganisationAccountService,
        { provide: RequestsService, useValue: requestsServiceMock },
        { provide: BusinessErrorService, useValue: businessErrorServiceMock },
        { provide: PendingRequestService, useValue: pendingRequestServiceMock },
        { provide: OrganisationAccountStore, useValue: storeMock },
      ],
    });
    service = TestBed.inject(OrganisationAccountService);
  });

  describe('mapApplication', () => {
    it('should correctly map the state to application format', () => {
      const state: OrganisationAccountOpeningApplicationState = {
        registrationStatus: true,
        registrationNumber: '12345678',
        name: 'Test Organisation',
        address: {
          line1: '123 Main St',
          line2: 'Apt 4',
          city: 'Anytown',
          county: 'West Sussex',
          postcode: '12345',
        },
        competentAuthority: 'ENGLAND',
        type: 'OTHER',
        otherTypeName: 'some classification name',
        codes: ['CodeA', 'CodeB', 'CodeC'],
      };

      const result = service['mapApplication'](state, 'ORGANISATION_ACCOUNT_CREATION_REQUEST_CREATE_ACTION_PAYLOAD');
      expect(result).toEqual({
        payloadType: 'ORGANISATION_ACCOUNT_CREATION_REQUEST_CREATE_ACTION_PAYLOAD',
        registrationNumber: '12345678',
        name: 'Test Organisation',
        competentAuthority: 'ENGLAND',
        line1: '123 Main St',
        line2: 'Apt 4',
        city: 'Anytown',
        county: 'West Sussex',
        postcode: '12345',
        type: 'OTHER',
        otherTypeName: 'some classification name',
        codes: ['CodeA', 'CodeB', 'CodeC'],
      });
    });
  });
});
