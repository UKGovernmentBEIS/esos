interface ErrorData {
  data: Array<Array<string>>;
  message: string;
  sectionName: string;
}

export interface NotificationErrorData {
  code: 'NOC1001' | 'NOC1002';
  data: Array<Array<ErrorData>>;
  message: string;
}
