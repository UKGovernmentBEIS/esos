import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';

import { reinitiateTaskMap } from '../workflow-related-create-actions/workflowCreateAction';

export const knownTaskTypeGuard: CanActivateFn = (route: ActivatedRouteSnapshot) =>
  !!reinitiateTaskMap.find((item) => item.taskTypePath === route.paramMap.get('taskType'));
