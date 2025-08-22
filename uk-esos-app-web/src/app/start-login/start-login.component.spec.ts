import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { SharedModule } from '@shared/shared.module';
import { BasePage, mockClass } from '@testing';

import { GovukComponentsModule } from 'govuk-components';

import { StartLoginComponent } from './start-login.component';

describe('StartLoginComponent', () => {
  let component: StartLoginComponent;
  let fixture: ComponentFixture<StartLoginComponent>;
  let page: Page;

  const authService = mockClass(AuthService);

  class Page extends BasePage<StartLoginComponent> {
    get continueButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukComponentsModule, SharedModule, RouterTestingModule, StartLoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              redirectUrl: 'http://localhost:4200/dashboard',
              email: 'test@email.com',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StartLoginComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the account name for advanced and restricted users', () => {
    fixture.detectChanges();

    page.continueButton.click();

    expect(authService.login).toHaveBeenCalledWith({
      redirectUri: 'http://localhost:4200/dashboard',
      loginHint: 'test@email.com',
    });
  });
});
