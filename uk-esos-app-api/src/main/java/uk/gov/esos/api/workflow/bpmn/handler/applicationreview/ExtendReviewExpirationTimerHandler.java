package uk.gov.esos.api.workflow.bpmn.handler.applicationreview;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestExpirationType;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.common.service.ExtendExpirationTimerService;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestExpirationVarsBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExtendReviewExpirationTimerHandler implements JavaDelegate {

    private final ExtendExpirationTimerService extendReviewExpirationTimerService;
    private final RequestExpirationVarsBuilder requestExpirationVarsBuilder;

    @Override
    public void execute(DelegateExecution execution) {

        final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
        final LocalDate dueDateLocal = extendReviewExpirationTimerService.extendTimer(requestId, RequestExpirationType.APPLICATION_REVIEW);
        final Date dueDate = Date.from(dueDateLocal
                .atTime(LocalTime.MIN)
                .atZone(ZoneId.systemDefault())
                .toInstant());

        Map<String, Object> expirationVars = requestExpirationVarsBuilder
                .buildExpirationVars(RequestExpirationType.APPLICATION_REVIEW, dueDate);
        execution.setVariables(expirationVars);
    }
}
