import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PersonnelListTemplateComponent } from './personnel-list-template.component';

describe('PersonListTemplateComponent', () => {
  let component: PersonnelListTemplateComponent;
  let fixture: ComponentFixture<PersonnelListTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonnelListTemplateComponent],
    });

    fixture = TestBed.createComponent(PersonnelListTemplateComponent);
    component = fixture.componentInstance;
    component.personnel = [
      {
        firstName: 'John',
        lastName: 'Doe',
        type: 'INTERNAL',
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        type: 'EXTERNAL',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heading text', () => {
    const headingElement = fixture.debugElement.query(By.css('.govuk-heading-m'));
    expect(headingElement.nativeElement.textContent).toBe('Add the assessment personnel (optional)');
  });

  it('should display the table with added persons', () => {
    const tableElement = fixture.debugElement.query(By.css('govuk-table'));
    expect(tableElement).toBeTruthy();
  });
});
