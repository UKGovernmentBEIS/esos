import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CertificateDetailsListSummaryTemplateComponent } from '@shared/components/summaries';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('CertificateDetailsListSummaryTemplateComponent', () => {
  let component: CertificateDetailsListSummaryTemplateComponent;
  let fixture: ComponentFixture<CertificateDetailsListSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<CertificateDetailsListSummaryTemplateComponent> {
    get tableCells() {
      return this.queryAll('tr > th, tr > td').map((el) => el.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(CertificateDetailsListSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.certificatesDetails = [
      {
        certificateNumber: 'dec1',
        validFrom: '2022-01-01T00:00:00.000Z',
        validUntil: '2024-01-01T00:00:00.000Z',
      },
      {
        certificateNumber: 'dec2',
        validFrom: '2020-01-01T00:00:00.000Z',
        validUntil: '2021-01-01T00:00:00.000Z',
      },
    ];
    component.columns = [
      { field: 'certificateNumber', header: 'Certificate number', widthClass: 'govuk-!-width-one-third' },
      { field: 'validFrom', header: 'Valid from' },
      { field: 'validUntil', header: 'Valid until' },
      { field: 'change', header: '' },
    ];
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.tableCells).toEqual([
      'Certificate number',
      'Valid from',
      'Valid until',
      '',
      'dec1',
      '1 Jan 2022',
      '1 Jan 2024',
      'Change',
      'dec2',
      '1 Jan 2020',
      '1 Jan 2021',
      'Change',
    ]);
  });
});
