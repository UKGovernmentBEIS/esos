import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { ActivatedRouteStub } from '../../../testing';
import { InvalidLinkComponent } from './invalid-link.component';

describe('InvalidLinkComponent', () => {
  let component: InvalidLinkComponent;
  let fixture: ComponentFixture<InvalidLinkComponent>;
  let element: HTMLElement;

  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, PageHeadingComponent],
      declarations: [InvalidLinkComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidLinkComponent);
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

  it('should display invalid link message on any unknown code', () => {
    activatedRoute.setQueryParamMap({ code: 'unknown code' });
    fixture.detectChanges();

    expect(element.querySelector('h1').textContent).toEqual('This link is invalid');
  });
});
