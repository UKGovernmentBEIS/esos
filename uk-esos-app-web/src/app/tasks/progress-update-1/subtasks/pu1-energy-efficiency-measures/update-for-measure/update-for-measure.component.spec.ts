import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import {
  mockProgressUpdate1P3Measure3,
  mockProgressUpdate1P3Measure4,
} from '@tasks/progress-update-1/testing/mock-data';
import { ActivatedRouteStub, BasePage } from '@testing';

import { ProgressUpdate1P3EnergyEfficiencyMeasure, RequestTaskItemDTO } from 'esos-api';

import {
  ProgressUpdate1EnergyEfficiencyMeasuresStep,
  PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
} from '../pu1-energy-efficiency-measures.helper';
import { UpdateForMeasureComponent } from './update-for-measure.component';
import { UPDATE_FOR_MEASURE_FORM_CONTENT } from './update-for-measure-content';

describe('UpdateForMeasureComponent', () => {
  let component: UpdateForMeasureComponent;
  let fixture: ComponentFixture<UpdateForMeasureComponent>;
  let store: RequestTaskStore;
  let page: Page;
  let route: ActivatedRouteStub;
  let payload: ProgressUpdate1TaskPayload;
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

    get reportReduction2024To2025Radios() {
      return this.queryAll<HTMLInputElement>('input[name$="reportReduction2024To2025"]');
    }

    get reportReduction2024To2025() {
      return this.reportReduction2024To2025Radios.find((radio) => radio.checked)?.value;
    }

    get reportReduction2023To2024Radios() {
      return this.queryAll<HTMLInputElement>('input[name$="reportReduction2023To2024"]');
    }

    get reportReduction2023To2024() {
      return this.reportReduction2023To2024Radios.find((radio) => radio.checked)?.value;
    }

    get reductionEnergyConsumption2024To2025() {
      return this.getInputValue('#reductionEnergyConsumption2024To2025');
    }

    set reductionEnergyConsumption2024To2025(value: number) {
      this.setInputValue('#reductionEnergyConsumption2024To2025', value);
    }

    get reductionEnergyConsumption2023To2024() {
      return this.getInputValue('#reductionEnergyConsumption2023To2024');
    }

    set reductionEnergyConsumption2023To2024(value: number) {
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
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [
              { ...mockProgressUpdate1P3Measure4, progressUpdate1P3EnergyEfficiencyMeasure: null },
              { ...mockProgressUpdate1P3Measure3, progressUpdate1P3EnergyEfficiencyMeasure: null },
            ],
            progressUpdate1P3AddedMeasure: [],
          },
        },
      };
    });

    describe('for measureImplType: "MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN"', () => {
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

        // expect in DOM
        expect(page.reportReduction2024To2025Radios.length).toEqual(2);
        expect(page.reportReduction2024To2025).toEqual(undefined);
        expect(page.reportReduction2023To2024Radios.length).toEqual(2);
        expect(page.reportReduction2023To2024).toEqual(undefined);

        expect(page.reductionEnergyConsumption2024To2025).toEqual('');
        expect(page.reductionEnergyConsumption2023To2024).toEqual('');
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

      it('should show and require estimationMethodType when reportReduction2024To2025 or reportReduction2023To2024 is true', () => {
        const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

        // select YES to show estimationMethodTypeRadios
        page.reportReduction2024To2025Radios[0].click();
        fixture.detectChanges();
        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodDescriptionElement).toBeDisabled();

        // select NO to hide estimationMethodTypeRadios
        page.reportReduction2024To2025Radios[1].click();
        fixture.detectChanges();
        expect(page.estimationMethodTypeRadios.length).toEqual(0);

        // select YES to show estimationMethodTypeRadios
        page.reportReduction2023To2024Radios[0].click();
        fixture.detectChanges();
        expect(page.estimationMethodTypeRadios.length).toEqual(4);

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
          'Select yes if you want to report energy consumption reduction between 6 December 2024 and 5 December 2025',
        );
        expect(page.errorSummary.textContent).toContain(
          'Select yes if you want to report energy consumption reduction between 6 December 2023 and 5 December 2024',
        );

        page.reportReduction2024To2025Radios[0].click();
        page.reportReduction2023To2024Radios[0].click();
        fixture.detectChanges();

        page.submitButton.click();
        fixture.detectChanges();

        expect(taskServiceSpy).toHaveBeenCalledTimes(0);
        expect(page.errorSummary).toBeVisible();
        expect(page.errorSummary.textContent).toContain('There is a problem');
        expect(page.errorSummary.textContent).toContain(
          'Enter the reduction in energy consumption between 6 December 2024 and 5 December 2025',
        );
        expect(page.errorSummary.textContent).toContain(
          'Enter the reduction in energy consumption between 6 December 2023 and 5 December 2024',
        );
        expect(page.errorSummary.textContent).toContain(
          'Select the method used to estimate the reduction in energy consumption',
        );
        expect(page.errorSummary.textContent).not.toContain('Enter the description');
      });

      it('should submit a valid form', () => {
        const taskServiceSpy = jest.spyOn(taskService, 'saveSubtask');

        page.reportReduction2024To2025Radios[0].click();
        page.reportReduction2023To2024Radios[0].click();
        fixture.detectChanges();

        page.reductionEnergyConsumption2024To2025 = 123;
        page.reductionEnergyConsumption2023To2024 = 234;
        page.estimationMethodTypeRadios[0].click();
        page.providedContext = 'Measure update context';

        page.submitButton.click();
        fixture.detectChanges();

        const expectedMeasureUpdate: ProgressUpdate1P3EnergyEfficiencyMeasure = {
          reportReduction2024To2025: true,
          reportReduction2023To2024: true,
          reductionEnergyConsumption2024To2025: 123,
          reductionEnergyConsumption2023To2024: 234,
          estimationMethodType: 'ENERGY_AUDIT',
          providedContext: 'Measure update context',
        };

        expect(page.errorSummary).toBeFalsy();
        expect(taskServiceSpy).toHaveBeenCalledTimes(1);
        expect(taskServiceSpy).toHaveBeenCalledWith({
          subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE,
          route: route,
          payload: {
            progressUpdate1P3: {
              progressUpdate1P3MeasuresUpdate: {
                progressUpdate1P3Measures: [
                  { ...mockProgressUpdate1P3Measure4, progressUpdate1P3EnergyEfficiencyMeasure: expectedMeasureUpdate },
                  { ...mockProgressUpdate1P3Measure3, progressUpdate1P3EnergyEfficiencyMeasure: null },
                ],
                progressUpdate1P3AddedMeasure: [],
              },
            },
          },
          applySideEffects: true,
        });
      });
    });

    describe('for measureImplType: "MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN"', () => {
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

        // expect in DOM
        expect(page.measureIsImplementedRadios.length).toEqual(2);
        expect(page.measureIsImplemented).toEqual(undefined);
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(2);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual(undefined);
        expect(page.reductionEnergyConsumption2024To2025).toEqual('');
        expect(page.reductionEnergyConsumption2023To2024).toEqual('');
        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodType).toEqual(undefined);

        // expect hidden
        expect(page.reportReduction2024To2025Radios.length).toEqual(0);
        expect(page.reportReduction2024To2025).toEqual(undefined);
        expect(page.reportReduction2023To2024Radios.length).toEqual(0);
        expect(page.reportReduction2023To2024).toEqual(undefined);

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
          'Enter the reduction in energy consumption between 6 December 2024 and 5 December 2025',
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
        page.reductionEnergyConsumption2024To2025 = 123;
        page.estimationMethodTypeRadios[2].click();
        page.estimationMethodDescription = 'The other description';
        page.providedContext = 'Measure update context1';

        page.submitButton.click();
        fixture.detectChanges();

        const expectedMeasureUpdate: ProgressUpdate1P3EnergyEfficiencyMeasure = {
          measureIsImplemented: true,
          measureImplementedByTheDateInActionPlan: true,
          reductionEnergyConsumption2024To2025: 123,
          reductionEnergyConsumption2023To2024: null,
          estimationMethodType: 'OTHER_METHOD',
          estimationMethodDescription: 'The other description',
          providedContext: 'Measure update context1',
        };

        expect(page.errorSummary).toBeFalsy();
        expect(taskServiceSpy).toHaveBeenCalledTimes(1);
        expect(taskServiceSpy).toHaveBeenCalledWith({
          subtask: PU1_ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
          currentStep: ProgressUpdate1EnergyEfficiencyMeasuresStep.UPDATE_FOR_MEASURE,
          route: route,
          payload: {
            progressUpdate1P3: {
              progressUpdate1P3MeasuresUpdate: {
                progressUpdate1P3Measures: [
                  { ...mockProgressUpdate1P3Measure4, progressUpdate1P3EnergyEfficiencyMeasure: null },
                  { ...mockProgressUpdate1P3Measure3, progressUpdate1P3EnergyEfficiencyMeasure: expectedMeasureUpdate },
                ],
                progressUpdate1P3AddedMeasure: [],
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
        progressUpdate1P3: {
          progressUpdate1P3MeasuresUpdate: {
            progressUpdate1P3Measures: [{ ...mockProgressUpdate1P3Measure4 }, { ...mockProgressUpdate1P3Measure3 }],
            progressUpdate1P3AddedMeasure: [],
          },
        },
      };
    });

    describe('for measureImplType: "MEASURE_IMPL_BEFORE_SUBMIT_ACTION_PLAN"', () => {
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

        // expect in DOM
        expect(page.reportReduction2024To2025Radios.length).toEqual(2);
        expect(page.reportReduction2024To2025).toEqual('true');
        expect(page.reductionEnergyConsumption2024To2025).toEqual('23');

        expect(page.reportReduction2023To2024Radios.length).toEqual(2);
        expect(page.reportReduction2023To2024).toEqual('true');
        expect(page.reductionEnergyConsumption2023To2024).toEqual('44444');

        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodType).toEqual('OTHER_METHOD');
        expect(page.estimationMethodDescription).toEqual('GG other method');

        expect(page.providedContextElement).toBeTruthy();
        expect(page.providedContext).toEqual('DD context');

        // expect hidden
        expect(page.measureIsImplementedRadios.length).toEqual(0);
        expect(page.measureIsImplemented).toEqual(undefined);
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(0);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual(undefined);

        expect(page.submitButton).toBeTruthy();
      });
    });

    describe('for measureImplType: "MEASURE_IMPL_AFTER_SUBMIT_ACTION_PLAN"', () => {
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

        // expect in DOM
        expect(page.measureIsImplementedRadios.length).toEqual(2);
        expect(page.measureIsImplemented).toEqual('true');
        expect(page.measureImplementedByTheDateInActionPlanRadios.length).toEqual(2);
        expect(page.measureImplementedByTheDateInActionPlan).toEqual('true');
        expect(page.reductionEnergyConsumption2024To2025).toEqual('11222');
        expect(page.reductionEnergyConsumption2023To2024).toEqual('');
        expect(page.estimationMethodTypeRadios.length).toEqual(4);
        expect(page.estimationMethodType).toEqual('ENERGY_AUDIT');
        expect(page.providedContextElement).toBeTruthy();
        expect(page.providedContext).toEqual('');

        // expect hidden
        expect(page.reportReduction2024To2025Radios.length).toEqual(0);
        expect(page.reportReduction2024To2025).toEqual(undefined);
        expect(page.reportReduction2023To2024Radios.length).toEqual(0);
        expect(page.reportReduction2023To2024).toEqual(undefined);

        expect(page.submitButton).toBeTruthy();
      });
    });
  });
});
