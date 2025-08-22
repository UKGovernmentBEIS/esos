import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { asyncData, mockClass } from '@testing';

import { MiReportsService } from 'esos-api';

import { ProgressUpdate2PublishedDataComponent } from './pu2-published-data.component';
import { ProgressUpdate2PublishedDataService } from './pu2-published-data.service';
import { mockProgressUpdate2PublishedDataResult } from './pu2-published-mock-data';

describe('ProgressUpdate2PublishedDataComponent', () => {
  let component: ProgressUpdate2PublishedDataComponent;
  let fixture: ComponentFixture<ProgressUpdate2PublishedDataComponent>;

  const miReportsService = {
    generateReport: jest.fn().mockReturnValue(asyncData(mockProgressUpdate2PublishedDataResult)),
  };
  const pu2PublishedDataService = mockClass(ProgressUpdate2PublishedDataService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MiReportsService, useValue: miReportsService },
        { provide: ProgressUpdate2PublishedDataService, useValue: pu2PublishedDataService },
      ],
    });
    fixture = TestBed.createComponent(ProgressUpdate2PublishedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and button', () => {
    expect(fixture.nativeElement.querySelector('esos-page-heading').textContent).toContain(
      'Progress Update 2 Published Data - Phase 3',
    );
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Export to excel');
  });

  it('should export when button clicked', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(miReportsService.generateReport).toHaveBeenCalledTimes(1);
    expect(pu2PublishedDataService.exportToExcel).toHaveBeenCalledTimes(1);
  });
});
