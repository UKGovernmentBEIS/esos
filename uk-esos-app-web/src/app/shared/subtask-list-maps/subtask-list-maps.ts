import { SubTaskListMap } from '@shared/types/sub-task-list-map.type';

import { AlternativeComplianceRoutes, EnergySavingsOpportunities, ResponsibleUndertaking } from 'esos-api';

export const alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes> = {
  title: 'Alternative routes to compliance',
  totalEnergyConsumptionReduction: {
    title: 'Total annual reduction in energy consumption and energy spend from implementing energy saving measures',
  },
  energyConsumptionReduction: {
    title: 'Total annual reduction in energy consumption and energy spend by organisational purpose',
  },
  energyConsumptionReductionCategories: {
    title: 'Total annual reduction in energy consumption and energy spend by energy saving category',
  },
  assets: {
    title: 'List your assets and activities that fall under each alternative compliance route',
  },
  iso50001CertificateDetails: {
    title: 'Provide details of your ISO 50001 certificate (optional)',
  },
  decCertificatesDetails: {
    title: 'Provide details about your Display Energy Certificate (DECs) (optional)',
  },
  gdaCertificatesDetails: {
    title: 'Provide details of your Green Deal Assessment (optional)',
  },
};

export const responsibleUndertakingMap: SubTaskListMap<ResponsibleUndertaking> = {
  title: 'Responsible undertaking',
  organisationDetails: {
    title: 'Enter the organisation details',
  },
  tradingDetails: {
    title: 'Does the organisation operate under a trading name that is different to the registered name?',
  },
  organisationContactDetails: {
    title: 'Enter the organisation’s contact details',
  },
  isBehalfOfTrust: {
    title: 'Does this ESOS notification include information in relation to energy consumption of a trust asset?',
  },
  hasOverseasParentDetails: {
    title: 'Does your organisation have a parent company to which the ESOS regulations do not extend?',
  },
  overseasParentDetails: {
    title: 'Enter the name of the overseas parent company',
  },
};

export const energySavingsOpportunityMap: SubTaskListMap<EnergySavingsOpportunities> = {
  title: 'Energy savings opportunities',
  implementationEnergyConsumption: {
    title:
      'Total annual reduction in energy consumption and energy spend from implementing energy saving opportunities',
  },
  energyConsumption: {
    title: 'Total annual reduction in energy consumption and energy spend by organisational purpose',
  },
  energySavingsCategories: {
    title: 'Total annual reduction in energy consumption and energy spend by energy saving category',
  },
};
