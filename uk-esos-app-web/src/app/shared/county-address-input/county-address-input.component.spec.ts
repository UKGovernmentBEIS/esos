import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormGroup, FormGroupName } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { CountyService } from '@core/services/county.service';
import { changeInputValue, getInputValue, MockType } from '@testing';

import { GovukValidators, TextInputComponent } from 'govuk-components';

import { CountyAddressDTO } from 'esos-api';

import { SharedModule } from '../shared.module';
import { CountyAddressInputComponent } from './county-address-input.component';

const mockCountyService: MockType<CountyService> = {
  getUkCounties: jest.fn().mockReturnValue(
    of([
      {
        id: 1,
        name: 'Cyprus',
      },
      {
        id: 2,
        name: 'Greece',
      },
      {
        id: 3,
        name: 'Afghanistan',
      },
    ]),
  ),
};

describe('CountyAddressInputComponent', () => {
  let component: CountyAddressInputComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;

  @Component({
    template: `
      <form [formGroup]="form">
        <fieldset govukFieldset>
          <legend govukLegend>What is your address?</legend>
          <esos-county-address-input formGroupName="address"></esos-county-address-input>
        </fieldset>
      </form>
    `,
  })
  class TestComponent {
    form = new FormGroup({
      address: new FormGroup(CountyAddressInputComponent.controlsFactory(null), [
        GovukValidators.required('This is required'),
      ]),
    });
  }

  const address: CountyAddressDTO = {
    line1: 'Street',
    line2: 'Neighbourhood',
    city: 'City',
    county: 'Greece',
    postcode: '23415',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TestComponent],
      providers: [{ provide: CountyService, useValue: mockCountyService }],
    })
      .overrideComponent(CountyAddressInputComponent, {
        set: { providers: [{ provide: ControlContainer, useExisting: FormGroupName }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CountyAddressInputComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render address labels', () => {
    const inputs = fixture.debugElement.queryAll(By.directive(TextInputComponent));
    const getLabel = (element: HTMLElement) => element.querySelector('label');
    expect(inputs.map((input) => getLabel(input.nativeElement).textContent)).toEqual([
      'Address line 1',
      'Address line 2 (optional)',
      'Town or city',
      'County (optional)',
      'Postcode',
    ]);
  });

  it('should set autocomplete attributes', () => {
    const inputs = fixture.debugElement.queryAll(By.directive(TextInputComponent));
    const getInput = (element: HTMLElement) => element.querySelector('input');
    expect(inputs.map((input) => getInput(input.nativeElement).autocomplete)).toEqual([
      'address-line1',
      'address-line2',
      'address-level2',
      'county',
      'postal-code',
    ]);
  });

  it('should update values on setValue', () => {
    hostComponent.form.get('address').setValue(<any>address);
    fixture.detectChanges();

    expect(getInputValue(fixture, '#address\\.line1')).toEqual(address.line1);
    expect(getInputValue(fixture, '#address\\.line2')).toEqual(address.line2);
    expect(getInputValue(fixture, '#address\\.city')).toEqual(address.city);
    expect(getInputValue(fixture, '#address\\.postcode')).toEqual(address.postcode);
    expect(getInputValue(fixture, '#address\\.county')).toEqual(`${address.county}`);
  });

  it('should apply field validations', () => {
    hostComponent.form.markAllAsTouched();
    fixture.detectChanges();

    expect(hostComponent.form.invalid).toBeTruthy();
    expect(Object.values(hostComponent.form.controls).every((control) => control.invalid)).toBeTruthy();

    const line1 = hostComponent.form.get('address.line1');
    expect(line1.errors).toEqual({ required: 'Enter an address' });
    changeInputValue(fixture, '#address\\.line1', 'a'.repeat(257));
    fixture.detectChanges();
    expect(line1.errors).toEqual({ maxlength: 'The address should not be more than 255 characters' });
    changeInputValue(fixture, '#address\\.line1', address.line1);
    fixture.detectChanges();
    expect(hostComponent.form.invalid).toBeTruthy();
    expect(line1.valid).toBeTruthy();

    const line2 = hostComponent.form.get('address.line2');
    changeInputValue(fixture, '#address\\.line2', 'a'.repeat(257));
    fixture.detectChanges();
    expect(line2.errors).toEqual({ maxlength: 'The address should not be more than 255 characters' });
    changeInputValue(fixture, '#address\\.line2', address.line2);
    fixture.detectChanges();
    expect(hostComponent.form.invalid).toBeTruthy();
    expect(line2.valid).toBeTruthy();

    const city = hostComponent.form.get('address.city');
    expect(city.errors).toEqual({ required: 'Enter a town or city' });
    changeInputValue(fixture, '#address\\.city', 'a'.repeat(257));
    fixture.detectChanges();
    expect(city.errors).toEqual({ maxlength: 'The city should not be more than 255 characters' });
    changeInputValue(fixture, '#address\\.city', address.city);
    fixture.detectChanges();
    expect(hostComponent.form.invalid).toBeTruthy();
    expect(city.valid).toBeTruthy();

    const county = hostComponent.form.get('address.county');
    expect(county.errors).toEqual(null);
    changeInputValue(fixture, '#address\\.county', address.county);
    fixture.detectChanges();
    expect(hostComponent.form.invalid).toBeTruthy();
    expect(county.valid).toBeTruthy();

    const postcode = hostComponent.form.get('address.postcode');
    expect(postcode.errors).toEqual({ required: 'Enter a postcode' });
    changeInputValue(fixture, '#address\\.postcode', 'a'.repeat(65));
    fixture.detectChanges();
    expect(postcode.errors).toEqual({ maxlength: 'The postcode should not be more than 64 characters' });
    changeInputValue(fixture, '#address\\.postcode', address.postcode);
    fixture.detectChanges();
    expect(hostComponent.form.valid).toBeTruthy();
    expect(postcode.valid).toBeTruthy();
  });
});
