interface ErrorData {
  data: Array<Array<string>>;
  message: string;
  sectionName: string;
}

export interface ActionPlanErrorData {
  code: 'AP1001' | 'AP1002';
  data: Array<Array<ErrorData>>;
  message: string;
}
