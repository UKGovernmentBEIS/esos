import { ItemDTO } from 'esos-api';

import { ItemLinkPipe } from './item-link.pipe';

type DatasetDTO = Pick<ItemDTO, 'requestType' | 'taskType'> & { expectedPath: (string | number)[] };

describe('ItemLinkPipe', () => {
  const pipe = new ItemLinkPipe();

  const taskId = 1;

  const dataSet: DatasetDTO[] = [
    // ORGANISATION_ACCOUNT_OPENING
    {
      requestType: 'ORGANISATION_ACCOUNT_OPENING',
      taskType: null,
      expectedPath: ['/tasks', taskId],
    },
    // NOTIFICATION_OF_COMPLIANCE_P3
    {
      requestType: 'NOTIFICATION_OF_COMPLIANCE_P3',
      taskType: null,
      expectedPath: ['/tasks', taskId],
    },
    // ACTION_PLAN_P3
    {
      requestType: 'ACTION_PLAN_P3',
      taskType: null,
      expectedPath: ['/tasks', taskId],
    },
    // ACCOUNT_CLOSURE
    {
      requestType: 'ACCOUNT_CLOSURE',
      taskType: null,
      expectedPath: ['/tasks', taskId],
    },
    // PROGRESS_UPDATE_1_P3
    {
      requestType: 'PROGRESS_UPDATE_1_P3',
      taskType: null,
      expectedPath: ['/tasks', taskId],
    },
    // PROGRESS_UPDATE_2_P3
    {
      requestType: 'PROGRESS_UPDATE_2_P3',
      taskType: null,
      expectedPath: ['/tasks', taskId],
    },

    // NULL
    {
      requestType: null,
      taskType: null,
      expectedPath: ['.'],
    },
  ];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it.each<DatasetDTO>(dataSet)(
    'should map $requestType . $taskType => $expectedPath',
    ({ requestType, taskType, expectedPath }) => {
      expect(
        pipe.transform({
          requestType: requestType,
          taskType: taskType,
          taskId: taskId,
        }),
      ).toEqual(expectedPath);
    },
  );
});
