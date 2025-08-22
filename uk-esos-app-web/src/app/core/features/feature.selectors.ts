import { map, OperatorFunction, pipe } from 'rxjs';

import { FeatureName, FeatureState } from '@core/features/feature.state';

export const selectIsFeatureEnabled = (feature: FeatureName): OperatorFunction<FeatureState, boolean> =>
  pipe(map((state) => state.features[feature]));

export const selectGtmContainerId: OperatorFunction<FeatureState, string> = pipe(
  map((state) => state.analytics.gtmContainerId),
);

export const selectExpirationTime: OperatorFunction<FeatureState, number> = pipe(map((state) => state.expirationTime));
