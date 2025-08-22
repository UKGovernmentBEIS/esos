import { Component, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { ORGANISATION_ACCOUNT_FORM } from '@accounts/core/organisation-account-form.token';
import { mockCreateOrganisationAccountStateProvider } from '@accounts/testing/mock-create-organisation-account.state.provider';
import { organisationDetailsFormProvider } from '@shared/components/organisation-details-form';
import { ORGANISATION_ACCOUNT_STATE_PROVIDER } from '@shared/providers/organisation-account.state.provider';

import { OrganisationDetailsComponent } from './organisation-details.component';

describe('OrganisationDetailsComponent', () => {
  let component: OrganisationDetailsComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    selector: 'esos-test',
    template: `
      <esos-organisation-details headerCaption="Organisation details" [form]="form"></esos-organisation-details>
    `,
    standalone: true,
    imports: [OrganisationDetailsComponent],
    providers: [organisationDetailsFormProvider],
  })
  class TestComponent {
    constructor(@Inject(ORGANISATION_ACCOUNT_FORM) readonly form: UntypedFormGroup) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: ORGANISATION_ACCOUNT_STATE_PROVIDER, useValue: mockCreateOrganisationAccountStateProvider },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
      ],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(OrganisationDetailsComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header caption', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.govuk-caption-l').textContent).toEqual('Organisation details');
  });
});
