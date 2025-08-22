import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { of, throwError } from 'rxjs';

import { AuthStore } from '@core/store/auth';
import { BusinessTestingModule, expectBusinessErrorToBe } from '@error/testing/business-error';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, RouterStubComponent } from '@testing';
import { cloneDeep } from 'lodash-es';

import { RegulatorAuthoritiesService } from 'esos-api';

import { SharedUserModule } from '../shared-user/shared-user.module';
import { DeleteComponent } from './delete/delete.component';
import { savePartiallyNotFoundRegulatorError } from './errors/business-error';
import { RegulatorsComponent } from './regulators.component';
import { mockRegulatorsRouteData } from './testing/mock-data';

describe('RegulatorsComponent', () => {
  let component: RegulatorsComponent;
  let fixture: ComponentFixture<RegulatorsComponent>;
  let page: Page;
  let router: Router;
  let authStore: AuthStore;

  class Page extends BasePage<RegulatorsComponent> {
    get addRegulatorButton() {
      return this.query<HTMLButtonElement>('button[id="add-regulator"][type="button"]');
    }

    get regulatorsForm() {
      return this.query<HTMLFormElement>('form[id="regulators-form"]');
    }

    get regulatorFormButton() {
      return this.regulatorsForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    }

    get nameSortingButton() {
      return this.regulatorsForm.querySelector<HTMLButtonElement>('thead button');
    }

    get rows() {
      return Array.from(this.regulatorsForm.querySelectorAll<HTMLTableRowElement>('tbody tr'));
    }

    get headers() {
      return Array.from(this.regulatorsForm.querySelectorAll<HTMLTableHeaderCellElement>('th'));
    }

    get nameColumns() {
      return this.rows.map((row) => row.querySelector('td'));
    }

    get nameLinks() {
      return this.nameColumns.map((name) => name.querySelector('a'));
    }

    get statusSelects() {
      return this.rows.map((row) => row.querySelector<HTMLSelectElement>('select[name$=".authorityStatus"]'));
    }

    set statusSelectValues(values: string[]) {
      this.rows.forEach((row, index) => {
        if (values[index]) {
          this.setInputValue('select[name$=".authorityStatus"]', values[index]);
        }
      });
    }
  }

  const regulatorAuthoritiesService: Partial<jest.Mocked<RegulatorAuthoritiesService>> = {
    getCaRegulators: jest.fn().mockReturnValue(of(mockRegulatorsRouteData.regulators)),
    updateCompetentAuthorityRegulatorUsersStatus: jest.fn().mockReturnValue(of(null)),
  };
  const expectUserOrderToBe = (indexes: number[]) =>
    expect(page.nameColumns.map((name) => name.textContent.trim())).toEqual(
      indexes.map(
        (index) =>
          `${mockRegulatorsRouteData.regulators.caUsers[index].firstName} ${mockRegulatorsRouteData.regulators.caUsers[index].lastName}`,
      ),
    );

  const activatedRouteStub = new ActivatedRouteStub(null, null, cloneDeep(mockRegulatorsRouteData));

  const createComponent = () => {
    jest.clearAllMocks();
    fixture = TestBed.createComponent(RegulatorsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([{ path: 'add', component: RouterStubComponent }]),
        SharedModule,
        SharedUserModule,
        BusinessTestingModule,
        PageHeadingComponent,
      ],
      declarations: [RegulatorsComponent, DeleteComponent, RouterStubComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RegulatorAuthoritiesService, useValue: regulatorAuthoritiesService },
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      status: 'ENABLED',
      roleType: 'REGULATOR',
      userId: '5reg',
    });
    router = TestBed.inject(Router);
  });

  beforeEach(createComponent);

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const element: HTMLElement = fixture.nativeElement;
    const header = element.querySelector('h1.govuk-heading-xl');

    expect(header).toBeTruthy();
    expect(header.innerHTML.trim()).toEqual('Regulator users');
  });

  it('should display the add new user button if applicable', () => {
    expect(page.addRegulatorButton).toBeTruthy();

    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = false;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(page.addRegulatorButton).toBeFalsy();
  });

  it('should navigate to add regulator form when clicking the add button', () => {
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockImplementation();
    const testData = cloneDeep(mockRegulatorsRouteData);

    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    page.addRegulatorButton.click();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should render a save changes button', () => {
    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = true;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(page.regulatorFormButton).toBeTruthy();
    expect(page.regulatorFormButton.innerHTML.trim()).toEqual('Save');

    testData.regulators.editable = false;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(page.regulatorFormButton).toBeFalsy();
  });

  it('should display correct dropdown values in regulators table', () => {
    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = true;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(Array.from(page.statusSelects[0].options).map((option) => option.textContent.trim())).toEqual(
      component.authorityStatuses.map((status) => status.text),
    );
  });

  it('should initialize with default sorting by created date', () => {
    expectUserOrderToBe([2, 0, 1, 3, 4]);
  });

  it('should sort by name', () => {
    page.nameSortingButton.click();
    fixture.detectChanges();

    expectUserOrderToBe([0, 3, 2, 1, 4]);

    page.nameSortingButton.click();
    fixture.detectChanges();

    expectUserOrderToBe([4, 1, 2, 3, 0]);
  });

  it('should hide select and locked if user status is pending', () => {
    expect(page.statusSelects[4]).toBeNull();
    expect(page.rows[4].querySelectorAll('td')[2].textContent).toEqual('Awaiting confirmation');
    expect(page.rows[4].querySelector('td .locked')).toBeFalsy();
  });

  it('should hide account status column if non-editable view', () => {
    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = false;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(page.headers.length).toEqual(2);
    expect(page.headers[0].textContent).toEqual('Name');
    expect(page.headers[1].textContent).toEqual('Job title');

    testData.regulators.editable = true;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(page.headers.length).toEqual(4);
    expect(page.headers[0].textContent).toEqual('Name');
    expect(page.headers[1].textContent).toEqual('Job title');
    expect(page.headers[2].textContent).toEqual('Account status');
  });

  it('should post only changed values on save', () => {
    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = true;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    page.statusSelectValues = ['DISABLED'];
    fixture.detectChanges();

    page.regulatorFormButton.click();
    fixture.detectChanges();

    expect(regulatorAuthoritiesService.updateCompetentAuthorityRegulatorUsersStatus).toHaveBeenCalledWith([
      {
        userId: '3reg',
        authorityStatus: 'DISABLED',
      },
    ]);
  });

  it('should post only changed values on save after sort', () => {
    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = true;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    page.statusSelectValues = ['DISABLED'];
    fixture.detectChanges();

    page.nameSortingButton.click();
    fixture.detectChanges();

    page.regulatorFormButton.click();
    fixture.detectChanges();

    expect(regulatorAuthoritiesService.updateCompetentAuthorityRegulatorUsersStatus).toHaveBeenCalledWith([
      {
        userId: '3reg',
        authorityStatus: 'DISABLED',
      },
    ]);
  });

  it('should have link only on user if no permission to edit', () => {
    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = false;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    expect(page.nameLinks.filter((link) => link).length).toEqual(1);
    expect(page.nameLinks.filter((link) => link)[0].textContent).toEqual('William Walker');
  });

  it('should show the business error page if a regulator is already deleted', async () => {
    regulatorAuthoritiesService.updateCompetentAuthorityRegulatorUsersStatus.mockReturnValue(
      throwError(() => new HttpErrorResponse({ error: { code: 'AUTHORITY1003' }, status: 400 })),
    );

    const testData = cloneDeep(mockRegulatorsRouteData);
    testData.regulators.editable = true;
    activatedRouteStub.setResolveMap(testData);
    fixture.detectChanges();

    page.statusSelectValues = ['DISABLED'];
    fixture.detectChanges();

    page.regulatorFormButton.click();
    fixture.detectChanges();

    await expectBusinessErrorToBe(savePartiallyNotFoundRegulatorError);
  });
});
