import { ChangeDetectionStrategy, Component, computed, Inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { BooleanRadioGroupComponent } from '@shared/boolean-radio-group/boolean-radio-group.component';
import { ActivityCodesGuidanceTemplateComponent } from '@shared/components/activity-codes-guidance-template/activity-codes-guidance-template.component';
import { ActivityCodesInputComponent } from '@shared/components/activity-codes-input/activity-codes-input.component';
import { sortOrganisations } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.helper';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { OrganisationAssociatedWithRU } from 'esos-api';

import { HelpContentComponent } from '../help-content/help-content.component';
import { ORGANISATION_STRUCTURE_SUB_TASK, OrganisationStructureCurrentStep } from '../organisation-structure.helper';
import { addEditFormProvider } from './add-edit-form.provider';

@Component({
  selector: 'esos-organisation-structure-add-edit',
  standalone: true,
  imports: [
    HelpContentComponent,
    SharedModule,
    WizardStepComponent,
    ActivityCodesInputComponent,
    ActivityCodesGuidanceTemplateComponent,
    BooleanRadioGroupComponent,
  ],
  templateUrl: './add-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [addEditFormProvider],
})
export class OrganisationStructureAddEditComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();

  private sameRUValue: Signal<boolean[]> = toSignal(this.form.get('areSameAsRU').valueChanges, {
    initialValue: this.form.get('areSameAsRU').value,
  });
  isChecked: Signal<boolean> = computed(() => {
    const sameRu = !!(this.sameRUValue() && this.sameRUValue()[0]);
    if (sameRu) {
      this.form.get('type').disable();
      this.form.get('otherTypeName').disable();
      this.form.get('codes').disable();
    } else {
      this.form.get('type').enable();
      this.form.get('otherTypeName').enable();
      this.form.get('codes').enable();
    }
    return sameRu;
  });

  constructor(
    @Inject(TASK_FORM) readonly form: UntypedFormGroup,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
    private store: RequestTaskStore,
  ) {}

  submit() {
    const index = +this.route.snapshot.params.index;

    this.service.saveSubtask({
      subtask: ORGANISATION_STRUCTURE_SUB_TASK,
      currentStep: index ? OrganisationStructureCurrentStep.EDIT : OrganisationStructureCurrentStep.ADD,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const organisations = sortOrganisations(payload.noc.organisationStructure.organisationsAssociatedWithRU);

        payload.noc.organisationStructure.organisationsAssociatedWithRU = !index
          ? [...(organisations ?? []), this.getFormData()]
          : organisations.map((organisation, i) => (i === index - 1 ? this.getFormData() : organisation));
      }),
    });
  }

  private getFormData(): OrganisationAssociatedWithRU {
    const areSameAsRU = this.form.get('areSameAsRU').value[0] ?? false;
    const codes = areSameAsRU ? null : this.form.get('codes').value?.filter((code) => code !== '' && code !== null);

    return {
      registrationNumberExist: this.form.get('registrationNumberExist').value,
      registrationNumber: this.form.get('registrationNumberExist').value
        ? this.form.get('registrationNumber').value
        : null,
      organisationName: this.form.get('organisationName').value,
      classificationCodesDetails: {
        areSameAsRU: areSameAsRU,
        codes: areSameAsRU
          ? null
          : {
              type: this.form.get('type').value,
              otherTypeName: this.form.get('type').value === 'SIC' ? null : this.form.get('otherTypeName').value,
              codes: codes,
            },
      },
      isPartOfArrangement: this.form.get('isPartOfArrangement').value,
      isParentOfResponsibleUndertaking: this.form.get('isParentOfResponsibleUndertaking').value,
      isSubsidiaryOfResponsibleUndertaking: this.form.get('isSubsidiaryOfResponsibleUndertaking').value,
      isPartOfFranchise: this.form.get('isPartOfFranchise').value,
      hasCeasedToBePartOfGroup: this.form.get('hasCeasedToBePartOfGroup').value,
    };
  }
}
