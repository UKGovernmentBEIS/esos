import { TestBed } from '@angular/core/testing';

import { firstValueFrom, of } from 'rxjs';

import { WorkflowItemsService } from '@shared/dashboard';

import { ItemsAssignedToMeService, ItemsAssignedToOthersService, UnassignedItemsService } from 'esos-api';

describe('WorkflowItemsService', () => {
  let service: WorkflowItemsService;

  const itemsAssignedToMeService = {
    getAssignedItems: jest.fn().mockReturnValue(of({})),
  };
  const itemsAssignedToOthersService = {
    getAssignedToOthersItems: jest.fn().mockReturnValue(of({})),
  };
  const unassignedItemsService = {
    getUnassignedItems: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkflowItemsService,
        { provide: ItemsAssignedToMeService, useValue: itemsAssignedToMeService },
        { provide: ItemsAssignedToOthersService, useValue: itemsAssignedToOthersService },
        { provide: UnassignedItemsService, useValue: unassignedItemsService },
      ],
    });
    service = TestBed.inject(WorkflowItemsService);
  });

  afterEach(() => {
    itemsAssignedToMeService.getAssignedItems.mockClear();
    itemsAssignedToOthersService.getAssignedToOthersItems.mockClear();
    unassignedItemsService.getUnassignedItems.mockClear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call assigned-to-me service method with appropriate account type', async () => {
    await firstValueFrom(service.getItems('assigned-to-me', 1, 10));
    expect(itemsAssignedToMeService.getAssignedItems).toHaveBeenCalledWith('ORGANISATION', 0, 10);
    expect(itemsAssignedToOthersService.getAssignedToOthersItems).not.toHaveBeenCalled();
    expect(unassignedItemsService.getUnassignedItems).not.toHaveBeenCalled();
  });

  it('should call assigned-to-others service method with appropriate account type', async () => {
    await firstValueFrom(service.getItems('assigned-to-others', 1, 10));
    expect(itemsAssignedToOthersService.getAssignedToOthersItems).toHaveBeenCalledWith('ORGANISATION', 0, 10);
    expect(itemsAssignedToMeService.getAssignedItems).not.toHaveBeenCalled();
    expect(unassignedItemsService.getUnassignedItems).not.toHaveBeenCalled();
  });

  it('should call unassigned service method with appropriate account type', async () => {
    await firstValueFrom(service.getItems('unassigned', 1, 10));
    expect(unassignedItemsService.getUnassignedItems).toHaveBeenCalledWith('ORGANISATION', 0, 10);
    expect(itemsAssignedToMeService.getAssignedItems).not.toHaveBeenCalled();
    expect(itemsAssignedToOthersService.getAssignedToOthersItems).not.toHaveBeenCalled();
  });
});
