import { Injectable } from '@angular/core';

import { SignalStore } from '@common/store';
import produce from 'immer';

import { ItemDTO, RequestActionInfoDTO, RequestTaskItemDTO, RequestTaskPayload } from 'esos-api';

import { initialState, RequestTaskState } from './request-task.state';

@Injectable({ providedIn: 'root' })
export class RequestTaskStore extends SignalStore<RequestTaskState> {
  constructor() {
    super(initialState);
  }

  setRequestTaskItem(requestTaskItem: RequestTaskItemDTO) {
    this.setState(
      produce(this.state, (state) => {
        state.requestTaskItem = requestTaskItem;
      }),
    );
  }

  setRelatedTasks(relatedTasks: ItemDTO[]) {
    this.setState(
      produce(this.state, (state) => {
        state.relatedTasks = relatedTasks;
      }),
    );
  }

  setTimeline(timeline: RequestActionInfoDTO[]) {
    this.setState(
      produce(this.state, (state) => {
        state.timeline = timeline;
      }),
    );
  }

  setTaskReassignedTo(taskReassignedTo: string) {
    this.setState(
      produce(this.state, (state) => {
        state.taskReassignedTo = taskReassignedTo;
      }),
    );
  }

  setIsEditable(isEditable: boolean) {
    this.setState(
      produce(this.state, (state) => {
        state.isEditable = isEditable;
      }),
    );
  }

  setMetadata(metadata: { [key: string]: unknown }) {
    this.setState(
      produce(this.state, (state) => {
        state.metadata = metadata;
      }),
    );
  }

  setPayload(payload: RequestTaskPayload) {
    this.setState(
      produce(this.state, (state) => {
        state.requestTaskItem.requestTask.payload = payload;
      }),
    );
  }
}
