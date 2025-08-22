import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedNocsComponent } from './submitted-nocs.component';

describe('SubmittedNocsComponent', () => {
  let component: SubmittedNocsComponent;
  let fixture: ComponentFixture<SubmittedNocsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(SubmittedNocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
