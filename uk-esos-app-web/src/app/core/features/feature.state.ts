export const FEATURES = [] as const;
export type FeatureName = (typeof FEATURES)[number];
export type FeaturesConfig = { [key in FeatureName]?: boolean };

export interface FeatureState {
  features: FeaturesConfig;
  expirationTime: number;
  analytics?: {
    gtmContainerId: string;
  };
}

export const initialState: FeatureState = {
  features: {},
  expirationTime: null,
  analytics: {
    gtmContainerId: '',
  },
};
