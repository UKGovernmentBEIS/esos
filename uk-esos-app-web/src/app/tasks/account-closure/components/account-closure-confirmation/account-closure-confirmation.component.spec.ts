import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AccountClosureConfirmationComponent } from './account-closure-confirmation.component';

describe('AccountClosureConfirmationComponent', () => {
  let component: AccountClosureConfirmationComponent;
  let fixture: ComponentFixture<AccountClosureConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountClosureConfirmationComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountClosureConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
