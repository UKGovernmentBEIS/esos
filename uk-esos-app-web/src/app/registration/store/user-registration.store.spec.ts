import { TestBed } from '@angular/core/testing';

import { firstValueFrom, of } from 'rxjs';

import { OperatorUserRegistrationDTO } from 'esos-api';

import { CountryServiceStub } from '../../../testing';
import { CountryService } from '../../core/services/country.service';
import { UserRegistrationStore } from './user-registration.store';

describe('UserRegistrationStore', () => {
  let store: UserRegistrationStore;

  const mockUserDTO: OperatorUserRegistrationDTO = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'job title',
    address: {
      line1: 'Line 1',
      line2: null,
      city: 'City',
      county: 'GR',
      postcode: 'PostCode',
    },
    phoneNumber: {
      countryCode: '44',
      number: '123',
    },
    mobileNumber: {
      countryCode: null,
      number: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CountryService, useClass: CountryServiceStub }],
    });
    store = TestBed.inject(UserRegistrationStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should return user info summary', async () => {
    jest.spyOn(store, 'select').mockReturnValue(of(mockUserDTO));

    const summary = await firstValueFrom(store.select('userRegistrationDTO'));

    expect(summary.firstName).toEqual('John');
    expect(summary.lastName).toEqual('Doe');
    expect(summary.phoneNumber.number).toEqual('123');
    expect(summary.phoneNumber.countryCode).toEqual('44');
    expect(summary.mobileNumber.number).toEqual(null);
    expect(summary.mobileNumber.countryCode).toEqual(null);
    expect(summary.address.line1).toEqual('Line 1');
    expect(summary.address.city).toEqual('City');
    expect(summary.address.postcode).toEqual('PostCode');
    expect(summary.address.county).toEqual('GR');
  });
});
