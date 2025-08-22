import { inject, Injectable } from '@angular/core';

import { FeatureStore } from '@core/features/feature.store';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly featureStore = inject(FeatureStore);
  private currentScript: HTMLScriptElement;

  enableGoogleTagManager() {
    const gtmContainerId = this.featureStore.getState()?.analytics?.gtmContainerId;
    if (!gtmContainerId) {
      console.warn('No google tag manager container id found. Environment will not log google analytics.');
      return;
    }

    if (this.currentScript) {
      console.warn('GTM script already loaded in DOM - Aborting...');
    }

    console.log('Logging to Google Analytics - [GTM Container ID]:', gtmContainerId);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const gtmScript = document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
    const firstHeadChild = document.head.childNodes[0];
    document.head.insertBefore(gtmScript, firstHeadChild);
    this.currentScript = gtmScript;
  }

  removeGoogleTagManager() {
    document.head.removeChild(this.currentScript);
    delete (window as any).dataLayer;
    this.currentScript = null;
  }
}
