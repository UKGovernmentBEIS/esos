import { SideEffect } from '@common/forms/side-effects';
import { getSignificantPercentage } from '@shared/components/energy-consumption-input/energy-consumption-input';
import { ENERGY_CONSUMPTION_SUB_TASK } from '@tasks/notification/subtasks/energy-consumption/energy-consumption.helper';
import produce from 'immer';
import { pick } from 'lodash-es';

import { EnergyConsumptionDetails, NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload } from 'esos-api';

export class EnergyConsumptionSideEffect extends SideEffect {
  override subtask = ENERGY_CONSUMPTION_SUB_TASK;

  apply<T extends NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload>(currentPayload: T): T {
    return produce(currentPayload, (payload) => {
      const energyConsumptionDetails = payload?.noc?.energyConsumptionDetails;
      const significantExists = energyConsumptionDetails?.significantEnergyConsumptionExists;
      const additionalInfoExists = energyConsumptionDetails?.additionalInformationExists;

      if (significantExists === false) {
        delete payload?.noc?.energyConsumptionDetails?.significantEnergyConsumption;
      } else if (significantExists === true) {
        this.handleSignificantEnergyConsumptionPercentage(energyConsumptionDetails);
      }
      this.handleIntensityRatioData(payload, energyConsumptionDetails);

      if (additionalInfoExists === false) {
        delete payload?.noc?.energyConsumptionDetails?.additionalInformation;
      }
    });
  }

  private handleIntensityRatioData(
    payload: NotificationOfComplianceP3ApplicationSubmitRequestTaskPayload,
    energyConsumption: EnergyConsumptionDetails,
  ): void {
    const consumption = energyConsumption?.significantEnergyConsumptionExists
      ? energyConsumption?.significantEnergyConsumption
      : energyConsumption?.totalEnergyConsumption;

    if (energyConsumption.energyIntensityRatioData) {
      const validKeys = pick(consumption, Object.keys(energyConsumption.energyIntensityRatioData));

      Object.entries(validKeys).forEach((e) => {
        if (e[1] === 0) {
          delete payload?.noc?.energyConsumptionDetails?.energyIntensityRatioData[e[0]];
        }
      });
    }
  }

  private handleSignificantEnergyConsumptionPercentage(energyConsumptionDetails: EnergyConsumptionDetails) {
    if (
      !!energyConsumptionDetails?.totalEnergyConsumption &&
      !!energyConsumptionDetails?.significantEnergyConsumption
    ) {
      energyConsumptionDetails.significantEnergyConsumption.significantEnergyConsumptionPct = getSignificantPercentage(
        energyConsumptionDetails.totalEnergyConsumption?.total,
        energyConsumptionDetails.significantEnergyConsumption?.total,
      );
    }
  }
}
