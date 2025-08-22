import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivatedRouteStub } from '@testing';

import { NotificationErrorComponent } from './notification-errors.component';
import { NotificationErrorData } from './notification-errors.interfaces';

describe('NotificationErrorComponent', () => {
  let component: NotificationErrorComponent;
  let fixture: ComponentFixture<NotificationErrorComponent>;

  const data: NotificationErrorData = {
    code: 'NOC1001',
    message: 'Invalid NOC',
    data: [
      [
        {
          sectionName: 'uk.gov.esos.api.reporting.noc.phase3.domain.contactpersons.ContactPersons',
          message: 'Invalid section data',
          data: [['primaryContact.lastName - must not be blank']],
        },
      ],
    ],
  };

  class RouterStub {
    getCurrentNavigation() {
      return {
        extras: {
          state: { data },
        },
      };
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: Router, useClass: RouterStub },
      ],
    });
    fixture = TestBed.createComponent(NotificationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
