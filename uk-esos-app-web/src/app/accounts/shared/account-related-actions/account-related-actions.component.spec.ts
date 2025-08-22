import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TextLinkItem } from '@shared/interfaces';
import { ActivatedRouteStub, BasePage } from '@testing';

import { AccountRelatedActionsComponent } from './account-related-actions.component';

const mockItems: TextLinkItem[] = [
  {
    text: 'TestA',
    link: ['test-a'],
  },
  {
    text: 'TestB',
    link: ['test-b'],
  },
];

describe('AccountRelatedActionsComponent', () => {
  let component: AccountRelatedActionsComponent;
  let fixture: ComponentFixture<AccountRelatedActionsComponent>;
  let page: Page;
  const activatedRouteStub = new ActivatedRouteStub();

  class Page extends BasePage<AccountRelatedActionsComponent> {
    get heading() {
      return this.query<HTMLElement>('h2');
    }

    get linksContent() {
      return this.queryAll<HTMLLIElement>('ul > li > a');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
      imports: [AccountRelatedActionsComponent],
    });
    fixture = TestBed.createComponent(AccountRelatedActionsComponent);
    component = fixture.componentInstance;
    component.actionItems = mockItems;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading.textContent.trim()).toEqual('Related actions');
    expect(page.linksContent.map((item) => item.textContent.trim())).toEqual(['TestA', 'TestB']);
  });
});
