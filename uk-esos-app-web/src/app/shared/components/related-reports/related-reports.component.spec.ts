import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionReportService } from '@shared/services/request-action-report.service';
import { ActivatedRouteStub, BasePage } from '@testing';

import { RelatedReportsComponent } from './related-reports.component';

describe('RelatedReportsComponent', () => {
  let component: RelatedReportsComponent;
  let fixture: ComponentFixture<RelatedReportsComponent>;
  let page: Page;

  class Page extends BasePage<RelatedReportsComponent> {
    get links() {
      return this.queryAll<HTMLLinkElement>('li > a');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestActionReportService, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    fixture = TestBed.createComponent(RelatedReportsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the links', async () => {
    expect(page.links.map((el) => [el.href, el.textContent])).toEqual([
      ['http://localhost/', 'Download PDF of submitted NOC'],
    ]);
  });
});
