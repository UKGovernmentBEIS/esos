import { Injectable } from '@angular/core';

import { utils, writeFileXLSX } from 'xlsx';

import { ExtendedMiReportResult } from './mi-interfaces';

@Injectable({ providedIn: 'root' })
export class MiReportsExportService {
  manipulateResultsAndExportToExcel(
    miReportResult: ExtendedMiReportResult,
    filename: string,
    manipulateResultsFn?: (
      parameter: {
        [x: string]: any;
      }[],
    ) => {
      [x: string]: any;
    }[],
  ) {
    const removedColumnsResults = miReportResult.results.map((result) =>
      miReportResult.columnNames
        .map((columnName) => ({ [columnName]: result[columnName] }))
        .reduce((prev, cur) => ({ ...prev, ...cur }), {}),
    );

    const results = manipulateResultsFn ? manipulateResultsFn(removedColumnsResults) : removedColumnsResults;
    const ws = utils.json_to_sheet(results);
    const wb = utils.book_new();

    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, `${filename}.xlsx`);
  }
}
