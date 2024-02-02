package uk.gov.esos.api.workflow.request.application.verificationbodyappointed;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.WorkflowService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestPayload;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.repository.RequestRepository;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
class RequestVerificationBodyService {

    private final RequestRepository requestRepository;
    private final WorkflowService workflowService;
    private final RequestService requestService;

    @Transactional
    public void appointVerificationBodyToRequestsOfAccount(Long verificationBodyId, Long accountId) {
        List<Request> requests = requestRepository.findAllByAccountId(accountId);

        List<Long> existingTaskIds = requests.stream()
                .map(request -> request.getRequestTasks().stream()
                        .filter(task -> RequestTaskType.getTaskTypesRelatedToVerifier().contains(task.getType())).collect(Collectors.toList()))
                .flatMap(List::stream)
                .map(RequestTask::getId)
                .collect(Collectors.toList());

        if(!existingTaskIds.isEmpty()) {
            //verifier_related_request_tasks_exist_for_account
            throw new BusinessException(ErrorCode.VERIFICATION_RELATED_REQUEST_TASKS_EXIST_FOR_ACCOUNT, existingTaskIds.toArray());
        }

        updateRequestsVbAndRemoveVerifierAssignee(requests, verificationBodyId);
    }

    @Transactional
    public void unappointVerificationBodyFromRequestsOfAccounts(Set<Long> accountIds) {
        List<Request> requests = requestRepository.findAllByAccountIdIn(accountIds);
        requests.forEach(request -> {
            List<RequestTask> tasks = request.getRequestTasks().stream()
                    .filter(task -> RequestTaskType.getTaskTypesRelatedToVerifier().contains(task.getType()))
                    .collect(Collectors.toList());
            tasks.forEach(task -> {
                workflowService.sendEvent(request.getId(), BpmnProcessConstants.VERIFICATION_BODY_STATE_CHANGED, Map.of());
                requestService.addActionToRequest(
                        request,
                        null,
                        RequestActionType.VERIFICATION_STATEMENT_CANCELLED,
                        null
                );
            });
        });
        updateRequestsVbAndRemoveVerifierAssignee(requests, null);
    }

    private void updateRequestsVbAndRemoveVerifierAssignee(List<Request> requests, Long newVerificationBodyId) {
        requests.forEach(request -> {
            request.setVerificationBodyId(newVerificationBodyId);
            RequestPayload requestPayload = request.getPayload();
            if(requestPayload != null) {
                requestPayload.setVerifierAssignee(null);
            }
        });
    }
}
