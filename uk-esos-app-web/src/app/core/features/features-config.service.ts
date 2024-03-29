import { Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { selectIsFeatureEnabled, selectMeasurementId, selectPropertyId } from '@core/features/feature.selectors';
import { FeatureName } from '@core/features/feature.state';
import { FeatureStore } from '@core/features/feature.store';

import { UIConfigurationService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class FeaturesConfigService {
  constructor(private readonly store: FeatureStore, private readonly configurationService: UIConfigurationService) {}

  initFeatureState(): Observable<boolean> {
    return this.configurationService.getUIFlags().pipe(
      tap((props) =>
        this.store.setState({
          features: props.features,
          analytics: {
            measurementId: props.analytics?.['measurementId'],
            propertyId: props.analytics?.['propertyId'],
          },
        }),
      ),
      map(() => true),
    );
  }

  isFeatureEnabled(feature: FeatureName): Observable<boolean> {
    return this.store.pipe(selectIsFeatureEnabled(feature));
  }

  getMeasurementId(): Observable<string> {
    return this.store.pipe(selectMeasurementId);
  }
  getPropertyId(): Observable<string> {
    return this.store.pipe(selectPropertyId);
  }
}
