import { ProgressUpdate1Error } from '@tasks/progress-update-1/progress-update-1-errors/progress-update-1-errors';

const progressUpdate1ErrorFactory = (errorFactory: () => ProgressUpdate1Error) => errorFactory();

export const progressUpdate1ValidationError = progressUpdate1ErrorFactory(() => new ProgressUpdate1Error(null));
