import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { BasePage } from '@testing';

import { GovukComponentsModule } from 'govuk-components';

import { BooleanRadioGroupComponent } from './boolean-radio-group.component';

describe('BooleanRadioGroupComponent', () => {
  let component: BooleanRadioGroupComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;
  let page: Page;

  @Component({
    template: `
      <form [formGroup]="form">
        <esos-boolean-radio-group controlName="flag">
          <div govukConditionalContent>
            <div govuk-radio formControlName="extra"></div>
          </div>
        </esos-boolean-radio-group>
      </form>
    `,
  })
  class TestComponent {
    form = new FormGroup({ flag: new FormControl(), extra: new FormControl() });
  }

  class Page extends BasePage<TestComponent> {
    get labels() {
      return this.queryAll<HTMLLabelElement>('label');
    }

    get inputs() {
      return this.queryAll<HTMLInputElement>('input');
    }

    get conditional() {
      return this.query<HTMLDivElement>('.govuk-radios__conditional--hidden');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooleanRadioGroupComponent, GovukComponentsModule, ReactiveFormsModule],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(BooleanRadioGroupComponent)).componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a yes/no decision', () => {
    expect(page.labels.map((label) => label.textContent.trim())).toEqual(['Yes', 'No']);
  });

  it('should reveal and enable child controls of the content if yes is selected', () => {
    const [yes, no] = page.inputs;
    fixture.detectChanges();

    expect(page.conditional).toBeTruthy();
    expect(page.conditional.id).toEqual('flag-option0-conditional');
    expect(yes.getAttribute('aria-expanded')).toEqual('false');
    expect(yes.getAttribute('aria-controls')).toEqual('flag-option0-conditional');
    expect(hostComponent.form.get('extra').disabled).toBeTruthy();

    yes.click();
    fixture.detectChanges();

    expect(page.conditional).toBeFalsy();
    expect(yes.getAttribute('aria-expanded')).toEqual('true');
    expect(hostComponent.form.value.flag).toEqual(true);
    expect(hostComponent.form.get('extra').disabled).toBeFalsy();

    no.click();
    fixture.detectChanges();

    expect(page.conditional).toBeTruthy();
    expect(yes.getAttribute('aria-expanded')).toEqual('false');
    expect(hostComponent.form.value.flag).toEqual(false);
    expect(hostComponent.form.get('extra').disabled).toBeTruthy();
  });
});
