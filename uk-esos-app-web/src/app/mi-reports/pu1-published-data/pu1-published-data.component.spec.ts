import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { asyncData, mockClass } from '@testing';

import { MiReportsService } from 'esos-api';

import { ProgressUpdate1PublishedDataComponent } from './pu1-published-data.component';
import { ProgressUpdate1PublishedDataService } from './pu1-published-data.service';
import { mockProgressUpdate1PublishedDataResult } from './pu1-published-mock-data';

describe('ProgressUpdate1PublishedDataComponent', () => {
  let component: ProgressUpdate1PublishedDataComponent;
  let fixture: ComponentFixture<ProgressUpdate1PublishedDataComponent>;

  const miReportsService = {
    generateReport: jest.fn().mockReturnValue(asyncData(mockProgressUpdate1PublishedDataResult)),
  };
  const pu1PublishedDataService = mockClass(ProgressUpdate1PublishedDataService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MiReportsService, useValue: miReportsService },
        { provide: ProgressUpdate1PublishedDataService, useValue: pu1PublishedDataService },
      ],
    });
    fixture = TestBed.createComponent(ProgressUpdate1PublishedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and button', () => {
    expect(fixture.nativeElement.querySelector('esos-page-heading').textContent).toContain(
      'Progress Update 1 Published Data - Phase 3',
    );
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Export to excel');
  });

  it('should export when button clicked', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(miReportsService.generateReport).toHaveBeenCalledTimes(1);
    expect(pu1PublishedDataService.exportToExcel).toHaveBeenCalledTimes(1);
  });
});
