import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PaginationBlockComponent } from './pagination-block.component';

describe('PaginationBlockComponent', () => {
  let component: PaginationBlockComponent;
  let fixture: ComponentFixture<PaginationBlockComponent>;
  let page: Page;

  class Page {
    private element: HTMLElement;

    constructor(protected readonly fixture: ComponentFixture<PaginationBlockComponent>) {
      this.element = fixture.nativeElement;
    }

    get paginationBlock() {
      return this.element.querySelector<HTMLElement>('.govuk-pagination--block');
    }

    get previousLink() {
      return this.element.querySelector<HTMLAnchorElement>('.govuk-pagination__prev a');
    }

    get previousLabel() {
      return this.element.querySelector<HTMLAnchorElement>('.govuk-pagination__prev .govuk-pagination__link-label');
    }

    get nextLink() {
      return this.element.querySelector<HTMLAnchorElement>('.govuk-pagination__next a');
    }

    get nextLabel() {
      return this.element.querySelector<HTMLAnchorElement>('.govuk-pagination__next .govuk-pagination__link-label');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).overrideComponent(PaginationBlockComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });

    fixture = TestBed.createComponent(PaginationBlockComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display nav when next and previous have no value', () => {
    expect(page.previousLink).toBeFalsy();
    expect(page.nextLink).toBeFalsy();
  });

  it('should only display previous link when previous is set', async () => {
    component.previous = {
      labelText: 'PreviousLabel',
      href: ['/previous'],
    };
    fixture.detectChanges();

    expect(page.previousLink).toBeTruthy();
    expect(page.previousLabel.textContent.trim()).toEqual('PreviousLabel');
    expect(page.nextLink).toBeFalsy();
    expect(page.nextLabel).toBeFalsy();
  });

  it('should only display next link when next is set', async () => {
    component.next = {
      labelText: 'NextLabel',
      href: ['/next'],
    };
    fixture.detectChanges();

    expect(page.previousLink).toBeFalsy();
    expect(page.previousLabel).toBeFalsy();
    expect(page.nextLink).toBeTruthy();
    expect(page.nextLabel.textContent.trim()).toEqual('NextLabel');
  });
});
