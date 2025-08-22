import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import {
  mockProgressUpdate2P3Measure2,
  mockProgressUpdate2P3Measure4,
  mockProgressUpdate2P3UpdatedAddedMeasure1,
  mockProgressUpdate2P3UpdatedAddedMeasure2,
} from '@tasks/progress-update-2/testing/mock-data';
import { ActivatedRouteStub, BasePage } from '@testing';

import { ProgressUpdate2P3EnergyEfficiencyMeasure, RequestTaskItemDTO } from 'esos-api';

import {
  ProgressUpdate2EnergyEfficiencyMeasuresStep,
  PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from '../pu2-energy-efficiency-measures.helper';
import { UpdateForMeasureComponent } from './update-for-measure.component';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from './update-for-measure-content';

describe('UpdateForMeasureComponent', () => {
  let component: UpdateForMeasureComponent;
  let fixture: ComponentFixture<UpdateForMeasureComponent>;
  let store: RequestTaskStore;
  let page: Page;
  let route: ActivatedRouteStub;
  let payload: ProgressUpdate2TaskPayload;
  let taskService;

  const createComponent = async (measureIndex) => {
    route = new ActivatedRouteStub({ measureIndex }, null, null, null, null, UPDATE_FOR_MEASURE_FORM_CONTENT.title);

    taskService = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      saveSubtask: () => {},
      payload,
    };

    await TestBed.configureTestingModule({
      imports: [UpdateForMeasureComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({ requestTask: { payload } } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(UpdateForMeasureComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  class Page extends BasePage<UpdateForMeasureComponent> {
    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get actionPlanMeasureComponent() {
      return this.query<HTMLElement>('esos-energy-efficiency-measure-summary-list-template');
    }
    get progressUpdate1ForActionPlanMeasureComponent() {
      return this.query<HTMLElement>('esos-pu1-update-for-measure-summary-template');
    }
    get progressUpdate1AddedMeasureComponent() {
      return this.query<HTMLElement>('esos-pu1-added-measure-summary-template');
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

    get measureIsImplementedRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="measureIsImplemented"]');
    }

    get measureIsImplemented() {
      return this.measureIsImplementedRadios.find((radio) => radio.checked)?.value;
    }

    get measureImplementedByTheDateInActionPlanRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="measureImplementedByTheDateInActionPlan"]');
    }

    get measureImplementedByTheDateInActionPlan() {
      return this.measureImplementedByTheDateInActionPlanRadios.find((radio) => radio.checked)?.value;
    }

    get reportReduction2025To2026Radios() {
      return this.queryAll<HTMLInputElement>('input[name$="reportReduction2025To2026"]');
    }

    get reportReduction2025To2026() {
      return this.reportReduction2025To2026Radios.find((radio) => radio.checked)?.value;
    }

    get reductionEnergyConsumption2025To2026() {
      return this.getInputValue('#reductionEnergyConsumption2025To2026');
    }

    set reductionEnergyConsumption2025To2026(value: number) {
      this.setInputValue('#reductionEnergyConsumption2025To2026', value);
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

    get providedContextElement() {
      return this.query<HTMLTextAreaElement>('#providedContextElement');
    }

    get providedContext() {
      return this.getInputValue('#providedContext');
    }

    set providedContext(value: string) {
      this.setInputValue('#providedContext', value);
    }
  }

  describe('for new measure update', () => {
    beforeEach(() => {
      payload = {
        progressUpdate2P3: {
          progressUpdate2P3MeasuresUpdate: {
            progressUpdate2P3Measures: [
              { ...mockProgressUpdate2P3Measure4, progressUpdate2P3EnergyEfficiencyMeasure: null },
              { ...mockProgressUpdate2P3Measure2, progressUpdate2P3EnergyEfficiencyMeasure: null },
            ],
            progressUpdate2P3UpdatedAddedMeasures: [
              { ...mockProgressUpdate2P3UpdatedAddedMeasure1, progressUpdate2P3EnergyEfficiencyMeasure: null },
              { ...mockProgressUpdate2P3UpdatedAddedMeasure2, progressUpdate2P3EnergyEfficiencyMeasure: null },
            ],
            progressUpdate2P3AddedMeasure: [],
          },
        },
      };
    });

    describe('for wasMeasureImplemented: true', () => {
      beforeEach(async () => {
        await createComponent('0');
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display all HTMLElements and form with 0 errors', () => {
        expect(page.errorSummary).toBeFalsy();
        expect(page.heading1).toBeTruthy();
        expect(page.heading1.textContent.trim()).toEqual(UPDATE_FOR_MEASURE_FORM_CONTENT.title);
        expect(page.actionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1ForActionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1AddedMeasureComponent).toBeNull();

        // expect in DOM
        expect(page.reportReduction2025To2026Radios.length).toEqual(2);
        expect(page.reportReduction2025To2026).toEqual(undefined);
        expect(page.reductionEnergyConsumption2025To2026).toEqual('');
        expect(page.providedContextElement).toBeTruthy();
        expect(page.providedContext).toEqual('');

        // expect hidden
        expect(page.measureIsImplementedRadios.length).toEqual(0);
        expect(page.measureIsImplemented).toEqual(undefined);
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(0);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual(undefined);
        expect(page.estimationMethodTypeRadios.length).toEqual(0);
        expect(page.estimationMethodType).toEqual(undefined);

        expect(page.submitButton).toBeTruthy();
      });

      it('should show and require estimationMethodType when reportReduction2025To2026 is true', () => {
        const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

        expect(page.estimationMethodTypeRadios.length).toEqual(0);

        // select NO to keep estimationMethodTypeRadios hidden
        page.reportReduction2025To2026Radios[1].click();
        fixture.detectChanges();
        expect(page.estimationMethodTypeRadios.length).toEqual(0);

        // select YES to show estimationMethodTypeRadios
        page.reportReduction2025To2026Radios[0].click();
        fixture.detectChanges();
        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodDescriptionElement).toBeDisabled();

        // select estimationMethodType OTHER to show estimationMethodDescription
        page.estimationMethodTypeRadios[2].click();
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
        expect(page.errorSummary.textContent).toContain(
          'Select yes if you want to report energy consumption reduction between 6 December 2025 and 5 December 2026',
        );

        page.reportReduction2025To2026Radios[0].click();
        fixture.detectChanges();

        page.submitButton.click();
        fixture.detectChanges();

        expect(taskServiceSpy).toHaveBeenCalledTimes(0);
        expect(page.errorSummary).toBeVisible();
        expect(page.errorSummary.textContent).toContain('There is a problem');
        expect(page.errorSummary.textContent).toContain(
          'Enter the reduction in energy consumption between 6 December 2025 and 5 December 2026',
        );
        expect(page.errorSummary.textContent).toContain(
          'Select the method used to estimate the reduction in energy consumption',
        );
        expect(page.errorSummary.textContent).not.toContain('Enter the description');
      });

      it('should submit a valid form', () => {
        const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

        page.reportReduction2025To2026Radios[0].click();
        fixture.detectChanges();

        page.reductionEnergyConsumption2025To2026 = 123;
        page.estimationMethodTypeRadios[0].click();
        page.providedContext = 'Measure update context';

        page.submitButton.click();
        fixture.detectChanges();

        const expectedMeasureUpdate: ProgressUpdate2P3EnergyEfficiencyMeasure = {
          reportReduction2025To2026: true,
          reductionEnergyConsumption2025To2026: 123,
          estimationMethodType: 'ENERGY_AUDIT',
          providedContext: 'Measure update context',
        };

        expect(page.errorSummary).toBeFalsy();
        expect(taskServiceSpy).toHaveBeenCalledTimes(1);
        expect(taskServiceSpy).toHaveBeenCalledWith({
          subtask: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          currentStep: ProgressUpdate2EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE,
          route: route,
          payload: {
            progressUpdate2P3: {
              progressUpdate2P3MeasuresUpdate: {
                progressUpdate2P3Measures: [
                  { ...mockProgressUpdate2P3Measure4, progressUpdate2P3EnergyEfficiencyMeasure: expectedMeasureUpdate },
                  { ...mockProgressUpdate2P3Measure2, progressUpdate2P3EnergyEfficiencyMeasure: null },
                ],
                progressUpdate2P3UpdatedAddedMeasures: [
                  { ...mockProgressUpdate2P3UpdatedAddedMeasure1, progressUpdate2P3EnergyEfficiencyMeasure: null },
                  { ...mockProgressUpdate2P3UpdatedAddedMeasure2, progressUpdate2P3EnergyEfficiencyMeasure: null },
                ],
                progressUpdate2P3AddedMeasure: [],
              },
            },
          },
          applySideEffects: true,
        });
      });
    });

    describe('for measure added in PU1', () => {
      beforeEach(async () => {
        await createComponent('3');
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display all HTMLElements and form with 0 errors', () => {
        expect(page.errorSummary).toBeFalsy();
        expect(page.heading1).toBeTruthy();
        expect(page.heading1.textContent.trim()).toEqual(UPDATE_FOR_MEASURE_FORM_CONTENT.title);
        expect(page.actionPlanMeasureComponent).toBeNull();
        expect(page.progressUpdate1ForActionPlanMeasureComponent).toBeNull();
        expect(page.progressUpdate1AddedMeasureComponent).toBeTruthy();

        // expect in DOM
        expect(page.reportReduction2025To2026Radios.length).toEqual(2);
        expect(page.reportReduction2025To2026).toEqual(undefined);
        expect(page.reductionEnergyConsumption2025To2026).toEqual('');
        expect(page.providedContextElement).toBeTruthy();
        expect(page.providedContext).toEqual('');

        // expect hidden
        expect(page.measureIsImplementedRadios.length).toEqual(0);
        expect(page.measureIsImplemented).toEqual(undefined);
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(0);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual(undefined);
        expect(page.estimationMethodTypeRadios.length).toEqual(0);
        expect(page.estimationMethodType).toEqual(undefined);

        expect(page.submitButton).toBeTruthy();
      });
    });

    describe('for wasMeasureImplemented: false', () => {
      beforeEach(async () => {
        await createComponent('1');
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display all HTMLElements and form with 0 errors', () => {
        expect(page.errorSummary).toBeFalsy();
        expect(page.heading1).toBeTruthy();
        expect(page.heading1.textContent.trim()).toEqual(UPDATE_FOR_MEASURE_FORM_CONTENT.title);
        expect(page.actionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1ForActionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1AddedMeasureComponent).toBeNull();

        // expect in DOM
        expect(page.measureIsImplementedRadios.length).toEqual(2);
        expect(page.measureIsImplemented).toEqual(undefined);
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(2);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual(undefined);
        expect(page.reductionEnergyConsumption2025To2026).toEqual('');
        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodType).toEqual(undefined);

        // expect hidden
        expect(page.reportReduction2025To2026Radios.length).toEqual(0);
        expect(page.reportReduction2025To2026).toEqual(undefined);

        expect(page.providedContextElement).toBeNull();

        expect(page.submitButton).toBeTruthy();
      });

      it('should show and require estimationMethodDescription when other estimation method is selected', () => {
        const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

        page.measureIsImplementedRadios[0].click();
        fixture.detectChanges();

        expect(page.estimationMethodDescriptionElement).toBeDisabled();

        page.estimationMethodTypeRadios[2].click();
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
        expect(page.errorSummary.textContent).toContain(
          'Select yes if this measure has been implemented no later than 5 December 2025',
        );

        page.measureIsImplementedRadios[0].click();
        fixture.detectChanges();

        expect(taskServiceSpy).toHaveBeenCalledTimes(0);
        expect(page.errorSummary).toBeVisible();
        expect(page.errorSummary.textContent).toContain('There is a problem');
        expect(page.errorSummary.textContent).toContain(
          'Select yes if this measure was implemented by the date in the action plan',
        );
        expect(page.errorSummary.textContent).toContain(
          'Enter the reduction in energy consumption between 6 December 2025 and 5 December 2026',
        );
        expect(page.errorSummary.textContent).toContain(
          'Select the method used to estimate the reduction in energy consumption',
        );
        expect(page.errorSummary.textContent).not.toContain('Enter the description');
      });

      it('should submit a valid form', () => {
        const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

        page.measureIsImplementedRadios[0].click();
        fixture.detectChanges();

        page.measureImplementedByTheDateInActionPlanRadios[0].click();
        page.reductionEnergyConsumption2025To2026 = 123;
        page.estimationMethodTypeRadios[2].click();
        page.estimationMethodDescription = 'The other description';
        page.providedContext = 'Measure update context1';

        page.submitButton.click();
        fixture.detectChanges();

        const expectedMeasureUpdate: ProgressUpdate2P3EnergyEfficiencyMeasure = {
          measureIsImplemented: true,
          measureImplementedByTheDateInActionPlan: true,
          reductionEnergyConsumption2025To2026: 123,
          estimationMethodType: 'OTHER_METHOD',
          estimationMethodDescription: 'The other description',
          providedContext: 'Measure update context1',
        };

        expect(page.errorSummary).toBeFalsy();
        expect(taskServiceSpy).toHaveBeenCalledTimes(1);
        expect(taskServiceSpy).toHaveBeenCalledWith({
          subtask: PU2_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          currentStep: ProgressUpdate2EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE,
          route: route,
          payload: {
            progressUpdate2P3: {
              progressUpdate2P3MeasuresUpdate: {
                progressUpdate2P3Measures: [
                  { ...mockProgressUpdate2P3Measure4, progressUpdate2P3EnergyEfficiencyMeasure: null },
                  { ...mockProgressUpdate2P3Measure2, progressUpdate2P3EnergyEfficiencyMeasure: expectedMeasureUpdate },
                ],
                progressUpdate2P3UpdatedAddedMeasures: [
                  { ...mockProgressUpdate2P3UpdatedAddedMeasure1, progressUpdate2P3EnergyEfficiencyMeasure: null },
                  { ...mockProgressUpdate2P3UpdatedAddedMeasure2, progressUpdate2P3EnergyEfficiencyMeasure: null },
                ],
                progressUpdate2P3AddedMeasure: [],
              },
            },
          },
          applySideEffects: true,
        });
      });
    });
  });

  describe('for existing measure update', () => {
    beforeEach(() => {
      payload = {
        progressUpdate2P3: {
          progressUpdate2P3MeasuresUpdate: {
            progressUpdate2P3Measures: [{ ...mockProgressUpdate2P3Measure4 }, { ...mockProgressUpdate2P3Measure2 }],
            progressUpdate2P3UpdatedAddedMeasures: [
              { ...mockProgressUpdate2P3UpdatedAddedMeasure1 },
              { ...mockProgressUpdate2P3UpdatedAddedMeasure2 },
            ],
            progressUpdate2P3AddedMeasure: [],
          },
        },
      };
    });

    describe('for wasMeasureImplemented: true', () => {
      beforeEach(async () => {
        await createComponent('0');
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display all HTMLElements and form with 0 errors', () => {
        expect(page.errorSummary).toBeFalsy();
        expect(page.heading1).toBeTruthy();
        expect(page.actionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1ForActionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1AddedMeasureComponent).toBeNull();

        // expect in DOM
        expect(page.reportReduction2025To2026Radios.length).toEqual(2);
        expect(page.reportReduction2025To2026).toEqual('true');
        expect(page.reductionEnergyConsumption2025To2026).toEqual('1111');

        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodType).toEqual('OTHER_METHOD');
        expect(page.estimationMethodDescription).toEqual('GG other method');

        expect(page.providedContextElement).toBeTruthy();
        expect(page.providedContext).toEqual('CTX PU2 M4');

        // expect hidden
        expect(page.measureIsImplementedRadios.length).toEqual(0);
        expect(page.measureIsImplemented).toEqual(undefined);
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(0);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual(undefined);

        expect(page.submitButton).toBeTruthy();
      });
    });

    describe('for (PU1) wasMeasureImplemented: false', () => {
      beforeEach(async () => {
        await createComponent('1');
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display all HTMLElements and form with 0 errors', () => {
        expect(page.errorSummary).toBeFalsy();
        expect(page.heading1).toBeTruthy();
        expect(page.actionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1ForActionPlanMeasureComponent).toBeTruthy();
        expect(page.progressUpdate1AddedMeasureComponent).toBeNull();

        // expect in DOM
        expect(page.measureIsImplementedRadios.length).toEqual(2);
        expect(page.measureIsImplemented).toEqual('true');
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(2);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual('true');
        expect(page.reductionEnergyConsumption2025To2026).toEqual('2143');
        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodType).toEqual('ACTION_PLAN_ESTIMATE');
        expect(page.providedContextElement).toBeTruthy();
        expect(page.providedContext).toEqual('');

        // expect hidden
        expect(page.reportReduction2025To2026Radios.length).toEqual(0);
        expect(page.reportReduction2025To2026).toEqual(undefined);

        expect(page.submitButton).toBeTruthy();
      });
    });
  });
});
