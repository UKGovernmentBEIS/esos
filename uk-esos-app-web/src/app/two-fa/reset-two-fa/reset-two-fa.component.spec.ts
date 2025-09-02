import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { mockClass } from '@testing';

import { OperatorUsersService, RegulatorUsersService, VerifierUsersService } from 'esos-api';

import { SharedUserModule } from '../../shared-user/shared-user.module';
import { ResetTwoFaComponent } from './reset-two-fa.component';

describe('ResetTwoFaComponent', () => {
  let component: ResetTwoFaComponent;
  let fixture: ComponentFixture<ResetTwoFaComponent>;

  const regulatorUsersService = mockClass(RegulatorUsersService);
  const verifierUsersService = mockClass(VerifierUsersService);
  const operatorUsersService = mockClass(OperatorUsersService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, SharedUserModule, PageHeadingComponent],
      declarations: [ResetTwoFaComponent],
      providers: [
        { provide: RegulatorUsersService, useValue: regulatorUsersService },
        { provide: VerifierUsersService, useValue: verifierUsersService },
        { provide: OperatorUsersService, useValue: operatorUsersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetTwoFaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
