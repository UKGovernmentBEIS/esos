interface ErrorData {
  data: Array<Array<string>>;
  message: string;
  sectionName: string;
}

export interface ProgressUpdate1ErrorData {
  code: 'PU11001' | 'PU11002' | 'PU11003';
  data: Array<Array<ErrorData>>;
  message: string;
}
