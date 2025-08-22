import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { GovukComponentsModule } from 'govuk-components';

import { InternalServerErrorComponent } from './internal-server-error.component';

describe('InternalServerErrorComponent', () => {
  let component: InternalServerErrorComponent;
  let fixture: ComponentFixture<InternalServerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeadingComponent, GovukComponentsModule],
      declarations: [InternalServerErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    const element: HTMLElement = fixture.nativeElement;
    const paragraphContents = Array.from(element.querySelectorAll<HTMLParagraphElement>('p')).map((el) =>
      el.textContent.trim(),
    );

    expect(element.querySelector('h1').textContent).toEqual('Sorry, there is a problem with the service');
    expect(paragraphContents).toEqual(['Try again later.', 'Contact the ESOS helpdesk  if you have any questions.']);
    expect(element.querySelector('a').href).toEqual('mailto:esos-it@environment-agency.gov.uk');
  });
});
