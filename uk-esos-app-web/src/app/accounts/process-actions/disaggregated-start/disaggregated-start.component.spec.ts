import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { mockedOrganisationAccount } from '@accounts/testing/mock-data';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestCreateActionProcessDTO } from 'esos-api';

import { ProcessActionsService } from '../process-actions.service';
import { DisaggregatedStartComponent } from './disaggregated-start.component';

describe('DisaggregatedStartComponent', () => {
  let component: DisaggregatedStartComponent;
  let fixture: ComponentFixture<DisaggregatedStartComponent>;
  let page: Page;
  let router: Router;
  let navigateSpy: jest.SpyInstance;
  let service: ProcessActionsService;

  const accountId = '0';
  const activatedRouteStub = new ActivatedRouteStub(undefined, undefined, {
    account: mockedOrganisationAccount,
  });
  const processActionsService: MockType<ProcessActionsService> = {
    processRequestCreateAction: jest.fn(),
  };

  class Page extends BasePage<DisaggregatedStartComponent> {
    get startButton() {
      return this.query<HTMLButtonElement>('button');
    }
  }

  const createComponent = async (
    accountId: string,
    requestType: RequestCreateActionProcessDTO['requestCreateActionType'],
  ) => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ProcessActionsService, useValue: processActionsService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    service = TestBed.inject(ProcessActionsService);

    fixture = TestBed.createComponent(DisaggregatedStartComponent);
    component = fixture.componentInstance;
    component.accountId = accountId;
    component.requestType = requestType;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  it('should create', async () => {
    await createComponent(accountId, 'PROGRESS_UPDATE_1_P3');
    expect(component).toBeTruthy();
    expect(page.startButton).toBeTruthy();
    expect(page.startButton.textContent.trim()).toEqual('Start Progress Update 1');
  });

  it('should navigate back to process-actions page if accountId is missing', async () => {
    await createComponent(undefined, 'PROGRESS_UPDATE_1_P3');

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: activatedRouteStub });
  });

  it('should navigate back to process-actions page if requestType is missing', async () => {
    await createComponent(accountId, undefined);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: activatedRouteStub });
  });

  it('Start button should be disable if missing accountId', async () => {
    await createComponent(undefined, 'PROGRESS_UPDATE_1_P3');
    expect(page.startButton).toBeDisabled();

    const onRequestButtonClickSpy = jest.spyOn(component, 'onRequestButtonClick');
    page.startButton.click();
    fixture.detectChanges();
    expect(onRequestButtonClickSpy).toHaveBeenCalledTimes(0);
  });

  it('Start button should be disable if missing requestType', async () => {
    await createComponent(accountId, undefined);
    expect(page.startButton).toBeDisabled();

    const onRequestButtonClickSpy = jest.spyOn(component, 'onRequestButtonClick');
    page.startButton.click();
    fixture.detectChanges();
    expect(onRequestButtonClickSpy).toHaveBeenCalledTimes(0);
  });

  it('should call ProcessActionsService when Start button is clicked', async () => {
    const requestType = 'PROGRESS_UPDATE_1_P3';
    await createComponent(accountId, requestType);
    const onRequestButtonClickSpy = jest.spyOn(component, 'onRequestButtonClick');
    const serviceSpy = jest.spyOn(service, 'processRequestCreateAction');

    page.startButton.click();
    fixture.detectChanges();

    expect(onRequestButtonClickSpy).toHaveBeenCalledTimes(1);
    expect(serviceSpy).toHaveBeenCalledWith({
      requestType,
      accountId: +accountId,
      isDisaggregateUndertaking: true,
    });
  });
});
