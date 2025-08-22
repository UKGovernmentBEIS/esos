import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { ActivatedRouteStub } from '../../../testing';
import { InvalidInvitationLinkComponent } from './invalid-invitation-link.component';

describe('InvalidInvitationLinkComponent', () => {
  let component: InvalidInvitationLinkComponent;
  let fixture: ComponentFixture<InvalidInvitationLinkComponent>;
  let activatedRoute: ActivatedRouteStub;
  let element: HTMLElement;

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [PageHeadingComponent],
      declarations: [InvalidInvitationLinkComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidInvitationLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display expired link message if code is EMAIL1001', () => {
    activatedRoute.setQueryParamMap({ code: 'EMAIL1001' });
    fixture.detectChanges();

    expect(element.querySelector('h1').textContent).toEqual('This link has expired');
  });

  it('should display expired link message if code is TOKEN1002', () => {
    activatedRoute.setQueryParamMap({ code: 'TOKEN1002' });
    fixture.detectChanges();

    expect(element.querySelector('h1').textContent).toEqual('This link is invalid');
    expect(element.querySelector('p').textContent.trim()).toEqual(
      'It seems you are signed in with another account. Make sure you sign out from the other account and try to access the link again.',
    );
  });

  it('should display invalid link message on any unhandled code', () => {
    activatedRoute.setQueryParamMap({ code: 'unhandledTokenCode' });
    fixture.detectChanges();

    expect(element.querySelector('h1').textContent).toEqual('This link is invalid');
    expect(element.querySelector('p').textContent.trim()).toEqual(
      'Contact the ESOS Service Desk for further assistance.',
    );
  });
});
