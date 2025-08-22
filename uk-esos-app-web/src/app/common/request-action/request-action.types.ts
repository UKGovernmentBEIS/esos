import { Injector, Type } from '@angular/core';

import { TaskSection } from '@common/shared/model';

export type RequestActionPageContent = {
  component?: Type<unknown>;
  header: string;
  headerDate?: string;
  sections?: TaskSection[];
};

export type RequestActionPageContentFactory = (injector: Injector) => RequestActionPageContent;
export type RequestActionPageContentFactoryMap = Record<string, RequestActionPageContentFactory>;
