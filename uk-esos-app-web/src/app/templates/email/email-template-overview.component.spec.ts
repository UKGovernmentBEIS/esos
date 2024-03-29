import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRouteStub, BasePage } from '../../../testing';
import { mockedEmailTemplate } from '../testing/mock-data';
import { EmailTemplateOverviewComponent } from './email-template-overview.component';

describe('EmailTemplateOverviewComponent,', () => {
  let component: EmailTemplateOverviewComponent;
  let fixture: ComponentFixture<EmailTemplateOverviewComponent>;
  let page: Page;
  let activatedRoute: ActivatedRouteStub;

  class Page extends BasePage<EmailTemplateOverviewComponent> {
    get title() {
      return this.query<HTMLDivElement>('.govuk-heading-l');
    }

    get contentSummaryList() {
      return this.queryAll<HTMLDListElement>('.govuk-summary-list')[0];
    }

    get content() {
      return Array.from(this.contentSummaryList.querySelectorAll('.govuk-summary-list__row'))
        .map((row) => [row.querySelector('dt'), row.querySelector('dd')])
        .map((pair) => pair.map((element) => element.textContent.trim()));
    }
  }

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub({ templateId: mockedEmailTemplate.id }, undefined, {
      emailTemplate: mockedEmailTemplate,
    });
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, EmailTemplateOverviewComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateOverviewComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the email template content', () => {
    expect(page.title.textContent).toEqual(mockedEmailTemplate.name);
    expect(page.content).toEqual([
      ['Email subject', mockedEmailTemplate.subject],
      ['Email message', mockedEmailTemplate.text],
    ]);
  });
});
