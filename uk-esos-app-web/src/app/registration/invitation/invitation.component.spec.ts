import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRouteStub } from '@testing';

import { GovukComponentsModule } from 'govuk-components';

import { InvitationComponent } from './invitation.component';

describe('InvitationComponent', () => {
  let component: InvitationComponent;
  let fixture: ComponentFixture<InvitationComponent>;
  let element: HTMLElement;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukComponentsModule, RouterTestingModule],
      declarations: [InvitationComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the account name for advanced and restricted users', () => {
    const userInfo = {
      accountName: 'Operator Faculty',
    };

    activatedRoute.setResolveMap({ operatorInvitedUserInfoDTO: userInfo });
    fixture.detectChanges();

    expect(element.querySelector('.govuk-panel__title').textContent).toEqual(
      `You have been added as a user to the account of Operator Faculty`,
    );
  });
});
