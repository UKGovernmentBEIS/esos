interface ErrorData {
  data: Array<Array<string>>;
  message: string;
  sectionName: string;
}

export interface ProgressUpdate2ErrorData {
  code: 'PU11002' | 'PU21004';
  data: Array<Array<ErrorData>>;
  message: string;
}
