import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { BasePage, changeInputValue } from '@testing';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';

import { GovukComponentsModule } from 'govuk-components';

import { SharedUserModule } from '../shared-user.module';
import { PasswordComponent } from './password.component';
import { PasswordService } from './password.service';
import { PASSWORD_FORM, passwordFormFactory } from './password-form.factory';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;
  let passwordService: PasswordService;

  @Component({
    template: `
      <form [formGroup]="form">
        <esos-password></esos-password>
        <button type="submit">Submit</button>
      </form>
    `,
    providers: [passwordFormFactory],
  })
  class TestComponent {
    constructor(@Inject(PASSWORD_FORM) readonly form: FormGroup) {}
  }

  class Page extends BasePage<TestComponent> {
    get password() {
      return this.query<HTMLInputElement>('#password');
    }

    set passwordValue(value: string) {
      changeInputValue(this.fixture, '#password', value);
    }

    set repeatedPasswordValue(value: string) {
      changeInputValue(this.fixture, '#validatePassword', value);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }

    get inputErrors() {
      return this.queryAll('.govuk-error-message .govuk-\\!-display-block').map((anchor) => anchor.textContent.trim());
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        GovukComponentsModule,
        RouterModule.forRoot([]),
        SharedUserModule,
      ],
      declarations: [PasswordComponent, TestComponent],
      providers: [provideZxvbnServiceForPSM(), PasswordService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(PasswordComponent)).componentInstance;
    page = new Page(fixture);
    passwordService = TestBed.inject(PasswordService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require the password', () => {
    jest.spyOn(passwordService, 'blacklisted').mockReturnValueOnce(of(null));

    page.passwordValue = '';
    page.repeatedPasswordValue = '';

    expect(page.inputErrors).toEqual([]);
    expect(component.formGroupDirective.form.get('password').errors.required).toBeTruthy();
    expect(component.formGroupDirective.form.get('password').errors.required).toEqual('Please enter your password');

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.inputErrors).toEqual([
      'Error: Please enter your password',
      'Error: Enter a strong password',
      'Error: Re-enter your password',
    ]);
  });

  it('should require more than 12 characters for the password', () => {
    jest.spyOn(passwordService, 'blacklisted').mockReturnValueOnce(of(null));

    page.passwordValue = 'test';
    page.repeatedPasswordValue = 'test';
    page.submitButton.click();
    fixture.detectChanges();

    expect(component.formGroupDirective.form.get('password').errors.minlength).toEqual(
      'Password must be 12 characters or more',
    );
    expect(page.inputErrors).toEqual([
      'Error: Password must be 12 characters or more',
      'Error: Enter a strong password',
    ]);
  });

  it('should not accept weak password', () => {
    jest.spyOn(passwordService, 'blacklisted').mockReturnValueOnce(of(null));

    page.passwordValue = '12345678';
    page.repeatedPasswordValue = '12345678';
    page.submitButton.click();
    fixture.detectChanges();

    expect(component.formGroupDirective.form.get('password').errors.weakPassword).toEqual('Enter a strong password');
    expect(page.inputErrors).toEqual([
      'Error: Password must be 12 characters or more',
      'Error: Enter a strong password',
    ]);
  });

  it('should require the passwords to match', () => {
    jest.spyOn(passwordService, 'blacklisted').mockReturnValueOnce(of(null));

    page.passwordValue = '12345678';
    page.repeatedPasswordValue = '123456789';
    page.submitButton.click();
    fixture.detectChanges();

    expect(component.formGroupDirective.form.errors.notEquivalent).toEqual(
      'Password and re-typed password do not match. Please enter both passwords again',
    );
    expect(page.inputErrors).toEqual([
      'Error: Password must be 12 characters or more',
      'Error: Enter a strong password',
    ]);
  });

  it('should not accept a blacklisted password', () => {
    jest
      .spyOn(passwordService, 'blacklisted')
      .mockReturnValueOnce(of({ blacklisted: 'Password has been blacklisted. Please select another password' }));

    page.passwordValue = 'ThisIsAStrongP@ssw0rd';
    page.repeatedPasswordValue = '123456789';
    page.submitButton.click();
    fixture.detectChanges();

    expect(component.formGroupDirective.form.get('password').errors.blacklisted).toEqual(
      'Password has been blacklisted. Please select another password',
    );
    expect(page.inputErrors).toEqual(['Error: Password has been blacklisted. Please select another password']);
  });
});
