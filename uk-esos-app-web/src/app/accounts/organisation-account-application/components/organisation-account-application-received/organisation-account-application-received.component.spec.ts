import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { OrganisationAccountApplicationReceivedComponent } from './organisation-account-application-received.component';

describe('OrganisationAccountApplicationReceivedComponent', () => {
  let component: OrganisationAccountApplicationReceivedComponent;
  let fixture: ComponentFixture<OrganisationAccountApplicationReceivedComponent>;
  let element: HTMLElement;

  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationAccountApplicationReceivedComponent],
      providers: [KeycloakService, { provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationAccountApplicationReceivedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct header', () => {
    const header = element.querySelector('govuk-panel');
    expect(header).toBeTruthy();
    expect(header.textContent).toContain('We have received your organisation account application.');
  });

  it('should display the correct information paragraphs', () => {
    const paragraphs = element.querySelectorAll('.govuk-body');
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].textContent).toContain(
      'Your regulator will review your application for an organisation account.',
    );
    expect(paragraphs[1].textContent).toContain(
      `You'll receive an email to confirm whether your request has been approved.`,
    );
  });

  it('should display the "What happens next" heading', () => {
    const heading = element.querySelector('.govuk-heading-m');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('What happens next');
  });
});
