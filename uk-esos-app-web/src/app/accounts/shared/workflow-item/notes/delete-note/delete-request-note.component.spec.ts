import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { SharedModule } from '@shared/shared.module';
import { UrlRequestType } from '@shared/types/url-request-type.type';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestNotesService } from 'esos-api';

import { DeleteRequestNoteComponent } from './delete-request-note.component';

describe('DeleteRequestNoteComponent', () => {
  let component: DeleteRequestNoteComponent;
  let fixture: ComponentFixture<DeleteRequestNoteComponent>;
  let page: Page;
  let router: Router;

  const requestNotesService: MockType<RequestNotesService> = {
    deleteRequestNote: jest.fn().mockReturnValue(of(null)),
  };

  class Page extends BasePage<DeleteRequestNoteComponent> {
    get submitButton() {
      return this.queryAll<HTMLButtonElement>('button')[0];
    }
  }

  const createComponent = async () => {
    fixture = TestBed.createComponent(DeleteRequestNoteComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  };

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('account related request', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RouterTestingModule, SharedModule, PageHeadingComponent],
        providers: [
          DestroySubject,
          { provide: RequestNotesService, useValue: requestNotesService },
          {
            provide: ActivatedRoute,
            useValue: new ActivatedRouteStub({ accountId: 1, 'request-id': 'requestId', noteId: 2 }),
          },
        ],
      }).compileComponents();
    });

    beforeEach(createComponent);

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should delete', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      page.submitButton.click();

      expect(requestNotesService.deleteRequestNote).toHaveBeenCalledTimes(1);
      expect(requestNotesService.deleteRequestNote).toHaveBeenCalledWith(2);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([`accounts/1/workflows/requestId`], {
        fragment: 'notes',
      });
    });
  });

  describe('CA related request', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [RouterTestingModule, SharedModule, PageHeadingComponent],
        providers: [
          DestroySubject,
          { provide: RequestNotesService, useValue: requestNotesService },
          {
            provide: ActivatedRoute,
            useValue: new ActivatedRouteStub(
              {
                'request-id': 'requestId',
                noteId: 2,
              },
              undefined,
              {
                requestType: 'batch-variation' as UrlRequestType,
              },
            ),
          },
        ],
      }).compileComponents();
    });

    beforeEach(createComponent);

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should delete', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      page.submitButton.click();

      expect(requestNotesService.deleteRequestNote).toHaveBeenCalledTimes(1);
      expect(requestNotesService.deleteRequestNote).toHaveBeenCalledWith(2);

      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([`workflows/batch-variation/requestId`], {
        fragment: 'notes',
      });
    });
  });
});
