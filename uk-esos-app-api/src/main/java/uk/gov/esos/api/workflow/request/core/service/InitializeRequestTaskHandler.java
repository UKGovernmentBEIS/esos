package uk.gov.esos.api.workflow.request.core.service;

import java.util.Set;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

public interface InitializeRequestTaskHandler {

    RequestTaskPayload initializePayload(Request request);

    Set<RequestTaskType> getRequestTaskTypes();
}
