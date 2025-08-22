import { Provider } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { RequestTaskStore } from '@common/request-task/+state';
import { notificationQuery } from '@tasks/notification/+state/notification.selectors';
import { TASK_FORM } from '@tasks/task-form.token';

import { GovukValidators } from 'govuk-components';

import { EnergyIntensityRatio, EnergyIntensityRatioDetails } from 'esos-api';

import { getSignificantOrTotalEnergyConsumption } from '../energy-consumption.helper';

export const energyIntensityRatioFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const intensityRatio = store.select(notificationQuery.selectEnergyConsumption)()?.energyIntensityRatioData;
    const energyConsumption = getSignificantOrTotalEnergyConsumption(
      store.select(notificationQuery.selectEnergyConsumption)(),
    );

    return fb.group(
      {
        ...(energyConsumption.buildings > 0 ? { buildings: createIntensityRatioGroup(intensityRatio?.buildings) } : {}),
        ...(energyConsumption.transport > 0 ? { transport: createIntensityRatioGroup(intensityRatio?.transport) } : {}),

        ...(energyConsumption.industrialProcesses > 0
          ? { industrialProcesses: createIntensityRatioGroup(intensityRatio?.industrialProcesses) }
          : {}),

        ...(energyConsumption.otherProcesses > 0
          ? { otherProcesses: createIntensityRatioGroup(intensityRatio?.otherProcesses) }
          : {}),
      },
      { updateOn: 'change' },
    );
  },
};

function createIntensityRatioGroup(value?: EnergyIntensityRatioDetails): UntypedFormGroup {
  return new UntypedFormGroup(
    {
      energyIntensityRatios: new FormArray(
        value?.energyIntensityRatios.map(createEnergyIntensityRatio) ?? [createEnergyIntensityRatio()],
      ),
      additionalInformation: new UntypedFormControl(value?.additionalInformation ?? null, [
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
    },
    { updateOn: 'change' },
  );
}

export function createEnergyIntensityRatio(value?: EnergyIntensityRatio): UntypedFormGroup {
  return new UntypedFormGroup(
    {
      ratio: new UntypedFormControl(value?.ratio ?? null, [
        GovukValidators.required('Enter a value for the intensity ratio'),
        GovukValidators.positiveNumber('Must be greater than 0'),
        GovukValidators.maxDecimalsValidator(6),
      ]),
      unit: new UntypedFormControl(value?.unit ?? null, [GovukValidators.required('Enter an indicator of activity')]),
    },
    { updateOn: 'change' },
  );
}
