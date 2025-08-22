import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { OrganisationAccountSummaryComponent } from './organisation-account-summary.component';

describe('OrganisationAccountSummaryComponent', () => {
  let component: OrganisationAccountSummaryComponent;
  let fixture: ComponentFixture<OrganisationAccountSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationAccountSummaryComponent, RouterTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: {} } }],
    }).compileComponents();
    fixture = TestBed.createComponent(OrganisationAccountSummaryComponent);
    component = fixture.componentInstance;

    component.organisation = {
      registrationNumber: 'PTSD123',
      name: 'Test Organisation',
      line1: '123 Test Street',
      line2: 'Suite 456',
      city: 'Test City',
      county: 'West Sussex',
      postcode: 'TST 123',
      competentAuthority: 'ENGLAND',
      type: 'OTHER',
      otherTypeName: 'some classification name',
      codes: ['CodeA', 'CodeB', 'CodeC'],
    };
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should display registration status correctly', async () => {
    component.organisation.registrationNumber = null;
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('[govukSummaryListRowValue]').textContent.trim()).toContain('No');
  });

  it('should not display change link when is not editable', async () => {
    component.isEditable = false;
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('dd[govukSummaryListRowActions]')).toBeNull();
  });

  it('should display organisation details correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('[govukSummaryListRowValue]').textContent.trim()).toContain('Yes');
    expect(compiled.textContent).toContain('PTSD123');
    expect(compiled.textContent).toContain('Test Organisation');
    expect(compiled.textContent).toContain('123 Test Street Suite 456'); // Notice the space before the comma
    expect(compiled.textContent).toContain('Test City');
    expect(compiled.textContent).toContain('West Sussex');
    expect(compiled.textContent).toContain('TST 123');
    expect(compiled.textContent).toContain('England');
    expect(compiled.textContent).toContain('Classification type: Other');
    expect(compiled.textContent).toContain('Classification name: some classification name');
    expect(compiled.textContent).toContain('Codes: CodeA, CodeB, CodeC');
  });
});
