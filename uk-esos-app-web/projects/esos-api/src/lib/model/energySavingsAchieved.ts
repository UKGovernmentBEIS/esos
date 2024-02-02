/**
 * ESOS API Documentation
 * ESOS API Documentation
 *
 * The version of the OpenAPI document: uk-esos-app-api 0.81.0-SNAPSHOT
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { EnergyConsumption } from './energyConsumption';
import { EnergySavingsCategories } from './energySavingsCategories';
import { EnergySavingsRecommendations } from './energySavingsRecommendations';

export interface EnergySavingsAchieved {
  energySavingsEstimation?: EnergyConsumption;
  energySavingCategoriesExist?: boolean;
  energySavingsCategories?: EnergySavingsCategories;
  totalEnergySavingsEstimation?: number;
  energySavingsRecommendationsExist: boolean;
  energySavingsRecommendations?: EnergySavingsRecommendations;
  details?: string;
}