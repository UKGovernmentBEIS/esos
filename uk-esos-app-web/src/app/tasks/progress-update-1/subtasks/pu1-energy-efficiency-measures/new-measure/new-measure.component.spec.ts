import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { mockProgressUpdate1P3AddedMeasure2 } from '@tasks/progress-update-1/testing/mock-data';
import { ActivatedRouteStub, BasePage } from '@testing';
import produce from 'immer';

import { ProgressUpdate1P3AddedMeasure, RequestTaskItemDTO } from 'esos-api';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from '../pu1-energy-efficiency-measures.helper';
import { NewMeasureComponent } from './new-measure.component';
import { NEW_MEASURE_FORM_CONTENT } from './new-measure-content';

describe('NewMeasureComponent', () => {
  let component: NewMeasureComponent;
  let fixture: ComponentFixture<NewMeasureComponent>;
  let store: RequestTaskStore;
  let page: Page;
  let route: ActivatedRouteStub;
  let payload: ProgressUpdate1TaskPayload;
  let taskService;

  const createComponent = () => {
    taskService = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      saveSubtask: () => {},
      payload,
    };

    TestBed.configureTestingModule({
      imports: [NewMeasureComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({ requestTask: { payload } } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(NewMeasureComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  class Page extends BasePage<NewMeasureComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get measureName() {
      return this.getInputValue('#measureName');
    }

    set measureName(value: string) {
      this.setInputValue('#measureName', value);
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

    get reductionEnergyConsumption2024To2025() {
      return this.getInputValue('#reductionEnergyConsumption2024To2025');
    }

    set reductionEnergyConsumption2024To2025(value: string) {
      this.setInputValue('#reductionEnergyConsumption2024To2025', value);
    }

    get reductionEnergyConsumption2023To2024() {
      return this.getInputValue('#reductionEnergyConsumption2023To2024');
    }

    set reductionEnergyConsumption2023To2024(value: string) {
      this.setInputValue('#reductionEnergyConsumption2023To2024', value);
    }

    get estimationMethodTypeRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="estimationMethodType"]');
    }

    get estimationMethodType() {
      return this.estimationMethodTypeRadios.find((radio) => radio.checked)?.value;
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

  describe('for newly added measure', () => {
    beforeEach(() => {
      route = new ActivatedRouteStub(null, null, null, null, null, NEW_MEASURE_FORM_CONTENT.title);
      payload = {
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [],
            progressUpdate1P3AddedMeasure: [],
          },
        },
      };
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual(NEW_MEASURE_FORM_CONTENT.title);

      expect(page.measureName).toEqual('');
      expect(page.measureSchemeCheckboxes.length).toEqual(7);
      expect(page.measureScheme).toEqual([]);
      expect(page.otherMeasureSchemeName).toEqual('');
      expect(page.reductionEnergyConsumption2024To2025).toEqual('');
      expect(page.reductionEnergyConsumption2023To2024).toEqual('');
      expect(page.estimationMethodTypeRadios.length).toEqual(3);
      expect(page.estimationMethodType).toEqual(undefined);
      expect(page.estimationMethodDescription).toEqual('');
      expect(page.measureContext).toEqual('');

      expect(page.submitButton).toBeTruthy();
    });

    it('should show and require estimationMethodDescription when other estimation method is selected', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      expect(page.estimationMethodDescriptionElement).toBeDisabled();

      page.estimationMethodTypeRadios[1].click();
      fixture.detectChanges();

      expect(page.estimationMethodDescriptionElement).toBeEnabled();

      page.submitButton.click();
      fixture.detectChanges();

      expect(taskServiceSpy).toHaveBeenCalledTimes(0);
      expect(page.errorSummary).toBeVisible();
      expect(page.errorSummary.textContent).toContain('Enter the description');
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
        'Enter the reduction in energy consumption between 6 December 2024 and 5 December 2025',
      );
      expect(page.errorSummary.textContent).toContain(
        'Select the method used to estimate the reduction in energy consumption',
      );
    });

    it('should submit a valid form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.measureName = 'Measure name 1';
      page.measureSchemeCheckboxes[0].click();
      page.measureSchemeCheckboxes[2].click();
      page.measureSchemeCheckboxes[6].click();
      page.otherMeasureSchemeName = 'O.M.S. name';
      page.reductionEnergyConsumption2024To2025 = '111';
      page.reductionEnergyConsumption2023To2024 = '22';

      page.estimationMethodTypeRadios[2].click();
      page.measureContext = 'Measure context';

      page.submitButton.click();
      fixture.detectChanges();

      const expectedAddedMeasure: ProgressUpdate1P3AddedMeasure = {
        measureName: 'Measure name 1',
        measureScheme: ['CLIMATE_CHANGE_AGREEMENTS_CCA', 'UK_EMISSIONS_TRADING_SCHEME_ETS', 'OTHER'],
        otherMeasureSchemeName: 'O.M.S. name',
        reductionEnergyConsumption2024To2025: 111,
        reductionEnergyConsumption2023To2024: 22,
        estimationMethodType: 'NO_METHOD_USED',
        measureContext: 'Measure context',
      };

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
        currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.ADD_NEW_MEASURE,
        route: route,
        payload: {
          progressUpdate1P3: {
            progressUpdate1P3MeasuresUpdate: {
              progressUpdate1P3Measures: [],
              progressUpdate1P3AddedMeasure: [expectedAddedMeasure],
            },
          },
        },
        applySideEffects: true,
      });
    });
  });

  describe('for existing added measure', () => {
    beforeEach(() => {
      route = new ActivatedRouteStub({ measureIndex: '0' }, null, null, null, null, NEW_MEASURE_FORM_CONTENT.editTitle);
      payload = {
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [],
            progressUpdate1P3AddedMeasure: [mockProgressUpdate1P3AddedMeasure2],
          },
        },
      };
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(page.errorSummary).toBeFalsy();
      expect(page.heading1).toBeTruthy();
      expect(page.heading1.textContent.trim()).toEqual(NEW_MEASURE_FORM_CONTENT.editTitle);

      expect(page.measureName).toEqual(mockProgressUpdate1P3AddedMeasure2.measureName);
      expect(page.measureScheme).toEqual(mockProgressUpdate1P3AddedMeasure2.measureScheme);
      expect(page.otherMeasureSchemeName).toEqual(mockProgressUpdate1P3AddedMeasure2.otherMeasureSchemeName);
      expect(page.estimationMethodType).toEqual(mockProgressUpdate1P3AddedMeasure2.estimationMethodType);
      expect(page.estimationMethodDescription).toEqual(
        mockProgressUpdate1P3AddedMeasure2.estimationMethodDescription ?? '',
      );
      expect(page.measureContext).toEqual(mockProgressUpdate1P3AddedMeasure2.measureContext ?? '');

      expect(page.submitButton).toBeTruthy();
    });

    it('should submit a valid unchanged form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
        currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.EDIT_NEW_MEASURE,
        route: route,
        payload,
        applySideEffects: true,
      });
    });

    it('should submit a valid changed form', () => {
      const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

      page.measureName = 'New measure name';

      page.reductionEnergyConsumption2024To2025 = '112';

      page.estimationMethodTypeRadios[0].click();
      page.measureContext = 'Measure context';

      page.submitButton.click();
      fixture.detectChanges();

      const expectedChangedMeasure: ProgressUpdate1P3AddedMeasure = {
        ...payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure[0],
        measureName: 'New measure name',
        reductionEnergyConsumption2024To2025: 112,
        estimationMethodType: 'ENERGY_AUDIT',
        measureContext: 'Measure context',
      };

      expect(page.errorSummary).toBeFalsy();
      expect(taskServiceSpy).toHaveBeenCalledTimes(1);
      expect(taskServiceSpy).toHaveBeenCalledWith({
        subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
        currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.EDIT_NEW_MEASURE,
        route: route,
        payload: produce(payload, (_payload) => {
          _payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3AddedMeasure[0] =
            expectedChangedMeasure;
        }),
        applySideEffects: true,
      });
    });
  });
});
