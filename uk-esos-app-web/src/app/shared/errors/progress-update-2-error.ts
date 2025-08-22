import { ProgressUpdate2Error } from '@tasks/progress-update-2/progress-update-2-errors/progress-update-2-errors';

const progressUpdate2ErrorFactory = (errorFactory: () => ProgressUpdate2Error) => errorFactory();

export const progressUpdate2ValidationError = progressUpdate2ErrorFactory(() => new ProgressUpdate2Error(null));
