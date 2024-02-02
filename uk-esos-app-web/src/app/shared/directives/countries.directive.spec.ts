import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CountryService } from '@core/services/country.service';
import { CountryServiceStub } from '@testing';

import { SelectComponent } from 'govuk-components';

import { CountriesDirective } from './countries.directive';

describe('CountriesDirective', () => {
  let directive: CountriesDirective;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    template: '<div govuk-select esosCountries [formControl]="country" label="Country"> </div>',
  })
  class TestComponent {
    country = new FormControl();
  }

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SelectComponent],
      declarations: [CountriesDirective, TestComponent],
      providers: [{ provide: CountryService, useClass: CountryServiceStub }],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(CountriesDirective)).injector.get(CountriesDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should assign countries to select', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));
    expect((selectElement.nativeElement as HTMLSelectElement).options[1].label).toEqual('Cyprus');
  });
});
