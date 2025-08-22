import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressUpdateResponsibleOfficerConfirmationComponent } from '@shared/components/summaries';
import { mockProgressUpdate1ResponsibleOfficerConfirmation } from '@tasks/progress-update-1/testing/mock-data';

describe('ProgressUpdateResponsibleOfficerConfirmationComponent', () => {
  let component: ProgressUpdateResponsibleOfficerConfirmationComponent;
  let fixture: ComponentFixture<ProgressUpdateResponsibleOfficerConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgressUpdateResponsibleOfficerConfirmationComponent],
    });
    fixture = TestBed.createComponent(ProgressUpdateResponsibleOfficerConfirmationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockProgressUpdate1ResponsibleOfficerConfirmation);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
