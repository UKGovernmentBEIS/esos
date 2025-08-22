import { Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { selectGtmContainerId, selectIsFeatureEnabled } from '@core/features/feature.selectors';
import { FeatureName } from '@core/features/feature.state';
import { FeatureStore } from '@core/features/feature.store';

import { UIConfigurationService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class FeaturesConfigService {
  constructor(
    private readonly store: FeatureStore,
    private readonly configurationService: UIConfigurationService,
  ) {}

  initFeatureState(): Observable<boolean> {
    return this.configurationService.getUIFlags().pipe(
      tap((props) =>
        this.store.setState({
          features: props.features,
          expirationTime: props.expirationTime,
          analytics: {
            gtmContainerId: props.analytics?.['gtmContainerId'],
          },
        }),
      ),
      map(() => true),
    );
  }

  isFeatureEnabled(feature: FeatureName): Observable<boolean> {
    return this.store.pipe(selectIsFeatureEnabled(feature));
  }

  getGtmContainerId(): Observable<string> {
    return this.store.pipe(selectGtmContainerId);
  }
}
