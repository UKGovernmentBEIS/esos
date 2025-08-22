import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActionPlanTaskPayload } from '@tasks/action-plan/action-plan.types';
import {
  mockActionPlanEnergyEfficiencyMeasure,
  mockEnergyEfficiencyMeasure1,
} from '@tasks/action-plan/testing/mock-data';
import { ActivatedRouteStub, BasePage } from '@testing';
import produce from 'immer';

import { EnergyEfficiencyMeasure, RequestTaskItemDTO } from 'esos-api';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  EnergyEfficiencyMeasuresStep,
} from '../energy-efficiency-measures.helper';
import { MeasureComponent } from './measure.component';
import { MEASURE_FORM_CONTENT } from './measure-content';

describe('MeasureComponent', () => {
  let component: MeasureComponent;
  let fixture: ComponentFixture<MeasureComponent>;
  let store: RequestTaskStore;
  let page: Page;
  let route: ActivatedRouteStub;
  let payload: ActionPlanTaskPayload;
  let implementationDateForMeasureFormControl: FormControl<string>;
  let taskService;

  const createComponent = () => {
    taskService = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      saveSubtask: () => {},
      payload,
    };

    TestBed.configureTestingModule({
      imports: [MeasureComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({ requestTask: { payload } } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(MeasureComponent);
    component = fixture.componentInstance;
    implementationDateForMeasureFormControl = component.form.get('implementationDateForMeasure') as FormControl<string>;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  class Page extends BasePage<MeasureComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get measureName() {
      return this.getInputValue('#measureName');
    }

    set measureName(value: string) {
      this.setInputValue('#measureName', value);
    }

    get isEnergySavingsOpportunityReportedInAuditRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="isEnergySavingsOpportunityReportedInAudit"]');
    }

    get isEnergySavingsOpportunityReportedInAudit() {
      return this.isEnergySavingsOpportunityReportedInAuditRadios.find((radio) => radio.checked)?.value;
    }

    get measureSchemeCheckboxes() {
      return this.queryAll<HTMLInputElement>('input[name$="measureScheme"]');
    }

    get measureScheme() {
      return this.measureSchemeCheckboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    }

    get otherMeasureSchemeName() {
      return this.getInputValue('#otherMeasureSchemeName');
    }

    set otherMeasureSchemeName(value: string) {
      this.setInputValue('#otherMeasureSchemeName', value);
    }

    set implementationDateForMeasureMonth(value: number) {
      this.setInputValue('#month-select-implementationDateForMeasure', value);
    }

    set implementationDateForMeasureYear(value: number) {
      this.setInputValue('#year-select-implementationDateForMeasure', value);
    }

    get buildings() {
      return this.getInputValue('#totalEnergySavingsExpected.buildings');
    }

    set buildings(value: string) {
      this.setInputValue('#totalEnergySavingsExpected.buildings', value);
    }

    get transport() {
      return this.getInputValue('#totalEnergySavingsExpected.transport');
    }

    set transport(value: string) {
      this.setInputValue('#totalEnergySavingsExpected.transport', value);
    }

    get industrialProcesses() {
      return this.getInputValue('#totalEnergySavingsExpected.industrialProcesses');
    }

    set industrialProcesses(value: string) {
      this.setInputValue('#totalEnergySavingsExpected.industrialProcesses', value);
    }

    get otherProcesses() {
      return this.getInputValue('#totalEnergySavingsExpected.otherProcesses');
    }

    set otherProcesses(value: string) {
      this.setInputValue('#totalEnergySavingsExpected.otherProcesses', value);
    }

    get totalkWh() {
      return this.query<HTMLDivElement>('#total-kWh').textContent.trim();
    }

    get energySavingsEstimateCalculatedTypeRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="energySavingsEstimateCalculatedType"]');
    }

    get energySavingsEstimateCalculatedType() {
      return this.energySavingsEstimateCalculatedTypeRadios.find((radio) => radio.checked)?.value;
    }

    get estimationMethodDescriptionElement() {
      return this.query<HTMLInputElement>('#estimationMethodDescription');
    }

    get estimationMethodDescription() {
      return this.getInputValue('#estimationMethodDescription');
    }

    set estimationMethodDescription(value: string) {
      this.setInputValue('#estimationMethodDescription', value);
    }

    get measureContext() {
      return this.getInputValue('#measureContext');
    }

    set measureContext(value: string) {
      this.setInputValue('#measureContext', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get errorSummaryListContents(): string[] {
      return Array.from(this.errorSummary.querySelectorAll<HTMLAnchorElement>('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  describe('for new measure', () => {
    beforeEach(() => {
      route = new ActivatedRouteStub(null, null, null, null, null, MEASURE_FORM_CONTENT.title);
      payload = { actionPlanP3: { energyEfficiencyMeasure: { haveEnergyEfficiencyMeasures: true } } };
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual(MEASURE_FORM_CONTENT.title);

      expect(page.measureName).toEqual('');
      expect(page.isEnergySavingsOpportunityReportedInAuditRadios.length).toEqual(2);
      expect(page.isEnergySavingsOpportunityReportedInAudit).toEqual(undefined);
      expect(page.measureSchemeCheckboxes.length).toEqual(7);
      expect(page.measureScheme).toEqual([]);
      expect(page.otherMeasureSchemeName).toEqual('');
      expect(implementationDateForMeasureFormControl.value).toEqual(null);
      expect(page.buildings).toEqual('');
      expect(page.transport).toEqual('');
      expect(page.industrialProcesses).toEqual('');
      expect(page.otherProcesses).toEqual('');
      expect(page.totalkWh).toEqual('0');
      expect(page.energySavingsEstimateCalculatedTypeRadios.length).toEqual(3);
      expect(page.energySavingsEstimateCalculatedType).toEqual(undefined);
      expect(page.estimationMethodDescription).toEqual('');
      expect(page.measureContext).toEqual('');

      expect(page.submitButton).toBeTruthy();
    });

    it('should show and require estimationMethodDescription when other estimation method is selected', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      expect(page.estimationMethodDescriptionElement).toBeDisabled();

      page.energySavingsEstimateCalculatedTypeRadios[2].click();
      fixture.detectChanges();

      expect(page.estimationMethodDescriptionElement).toBeEnabled();

      page.submitButton.click();
      fixture.detectChanges();

      expect(taskServiceSpy).toHaveBeenCalledTimes(0);
      expect(page.errorSummary).toBeVisible();
      expect(page.errorSummary.textContent).toContain('Enter the description');
    });

    it('should calculate Total estimated energy savings', () => {
      expect(page.totalkWh).toEqual('0');

      page.buildings = '11';
      fixture.detectChanges();
      expect(page.totalkWh).toEqual('11');

      page.transport = '22';
      fixture.detectChanges();
      expect(page.totalkWh).toEqual('33');

      page.industrialProcesses = '33';
      fixture.detectChanges();
      expect(page.totalkWh).toEqual('66');

      page.otherProcesses = '44';
      fixture.detectChanges();
      expect(page.totalkWh).toEqual('110');
    });

    it('should display errors if trying to submit an invalid form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(taskServiceSpy).toHaveBeenCalledTimes(0);
      expect(page.errorSummary).toBeVisible();
      expect(page.errorSummary.textContent).toContain('There is a problem');
      expect(page.errorSummary.textContent).toContain('Enter the measure name');
      expect(page.errorSummary.textContent).toContain(
        'Select yes if this measure is a result of an energy savings opportunity reported in an energy audit',
      );
      expect(page.errorSummary.textContent).toContain('Select implementation date for the measure');
      expect(page.errorSummary.textContent).toContain('Select how was the total energy savings estimate calculated');
      expect(page.errorSummary.textContent).toContain('Total estimated energy savings must be greater than 0 kWh');
    });

    it('should submit a valid form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.measureName = 'Measure name 1';
      page.isEnergySavingsOpportunityReportedInAuditRadios[0].click();
      page.measureSchemeCheckboxes[0].click();
      page.measureSchemeCheckboxes[2].click();
      page.measureSchemeCheckboxes[6].click();
      page.otherMeasureSchemeName = 'O.M.S. name';
      page.implementationDateForMeasureMonth = 2;
      page.implementationDateForMeasureYear = 2025;

      page.transport = '1000';
      page.energySavingsEstimateCalculatedTypeRadios[0].click();
      page.measureContext = 'Measure context';

      page.submitButton.click();
      fixture.detectChanges();

      const expectedEnergyEfficiencyMeasure: EnergyEfficiencyMeasure = {
        measureName: 'Measure name 1',
        isEnergySavingsOpportunityReportedInAudit: true,
        measureScheme: ['CLIMATE_CHANGE_AGREEMENTS_CCA', 'UK_EMISSIONS_TRADING_SCHEME_ETS', 'OTHER'],
        otherMeasureSchemeName: 'O.M.S. name',
        implementationDateForMeasure: '2025-03-01',
        totalEnergySavingsExpected: {
          buildings: 0,
          transport: 1000,
          industrialProcesses: 0,
          otherProcesses: 0,
          total: 1000,
        },
        energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
        measureContext: 'Measure context',
      };

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
        currentStep: EnergyEfficiencyMeasuresStep.MEASURE_FORM,
        route: route,
        payload: {
          actionPlanP3: {
            energyEfficiencyMeasure: {
              haveEnergyEfficiencyMeasures: true,
              energyEfficiencyMeasures: [expectedEnergyEfficiencyMeasure],
            },
          },
        },
        applySideEffects: true,
      });
    });
  });

  describe('for existing measure', () => {
    beforeEach(() => {
      route = new ActivatedRouteStub({ measureIndex: '0' }, null, null, null, null, MEASURE_FORM_CONTENT.editTitle);
      payload = { actionPlanP3: { energyEfficiencyMeasure: mockActionPlanEnergyEfficiencyMeasure } };
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual(MEASURE_FORM_CONTENT.editTitle);

      expect(page.measureName).toEqual(mockEnergyEfficiencyMeasure1.measureName);
      expect(page.isEnergySavingsOpportunityReportedInAudit).toEqual(
        `${mockEnergyEfficiencyMeasure1.isEnergySavingsOpportunityReportedInAudit}`,
      );
      expect(page.measureScheme).toEqual(mockEnergyEfficiencyMeasure1.measureScheme);
      expect(page.otherMeasureSchemeName).toEqual(mockEnergyEfficiencyMeasure1.otherMeasureSchemeName);
      expect(implementationDateForMeasureFormControl.value).toEqual(
        mockEnergyEfficiencyMeasure1.implementationDateForMeasure,
      );
      expect(page.buildings).toEqual(`${mockEnergyEfficiencyMeasure1.totalEnergySavingsExpected.buildings}`);
      expect(page.transport).toEqual(`${mockEnergyEfficiencyMeasure1.totalEnergySavingsExpected.transport}`);
      expect(page.industrialProcesses).toEqual(
        `${mockEnergyEfficiencyMeasure1.totalEnergySavingsExpected.industrialProcesses}`,
      );
      expect(page.otherProcesses).toEqual(`${mockEnergyEfficiencyMeasure1.totalEnergySavingsExpected.otherProcesses}`);
      expect(page.totalkWh).toEqual(`${mockEnergyEfficiencyMeasure1.totalEnergySavingsExpected.total}`);
      expect(page.energySavingsEstimateCalculatedType).toEqual(
        mockEnergyEfficiencyMeasure1.energySavingsEstimateCalculatedType,
      );
      expect(page.estimationMethodDescription).toEqual(mockEnergyEfficiencyMeasure1.estimationMethodDescription ?? '');
      expect(page.measureContext).toEqual(mockEnergyEfficiencyMeasure1.measureContext ?? '');

      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid unchanged form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
        currentStep: EnergyEfficiencyMeasuresStep.EDIT_MEASURE,
        route: route,
        payload,
        applySideEffects: true,
      });
    });

    it('should submit a valid changed form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.measureName = 'New measure name';
      page.isEnergySavingsOpportunityReportedInAuditRadios[1].click();
      page.implementationDateForMeasureMonth = 2;
      page.implementationDateForMeasureYear = 2025;

      page.energySavingsEstimateCalculatedTypeRadios[0].click();
      page.measureContext = 'Measure context';

      page.submitButton.click();
      fixture.detectChanges();

      const expectedEnergyEfficiencyMeasure: EnergyEfficiencyMeasure = {
        ...payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures[0],
        measureName: 'New measure name',
        isEnergySavingsOpportunityReportedInAudit: false,
        implementationDateForMeasure: '2025-03-01',
        energySavingsEstimateCalculatedType: 'ENERGY_AUDIT',
        measureContext: 'Measure context',
      };

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
        currentStep: EnergyEfficiencyMeasuresStep.EDIT_MEASURE,
        route: route,
        payload: produce(payload, (_payload) => {
          _payload.actionPlanP3.energyEfficiencyMeasure.energyEfficiencyMeasures[0] = expectedEnergyEfficiencyMeasure;
        }),
        applySideEffects: true,
      });
    });
  });
});
