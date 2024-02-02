import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { timer } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { BasePage } from '@testing';

import { GovukComponentsModule } from 'govuk-components';

import { PendingButtonDirective } from './pending-button.directive';

describe('PendingButtonDirective', () => {
  let directive: PendingButtonDirective;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  @Component({
    template: ` <button esosPendingButton govukButton type="submit" (click)="startRequest()">Submit</button> `,
    providers: [PendingRequestService],
  })
  class TestComponent {
    constructor(private readonly pendingRequest: PendingRequestService) {}

    startRequest() {
      timer(500).pipe(this.pendingRequest.trackRequest()).subscribe();
    }
  }

  class Page extends BasePage<TestComponent> {
    get button() {
      return this.query('button');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GovukComponentsModule, PendingButtonDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    page = new Page(fixture);

    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(PendingButtonDirective)).componentInstance;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should disable the button if a request is pending', fakeAsync(() => {
    expect(page.button.disabled).toBeFalsy();

    page.button.click();
    fixture.detectChanges();
    expect(page.button.disabled).toBeTruthy();

    tick(500);
    fixture.detectChanges();
    expect(page.button.disabled).toBeFalsy();
  }));
});
