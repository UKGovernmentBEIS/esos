package uk.gov.esos.api.workflow.request.flow.common.service;

import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestExpirationType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RequestPayloadRdeable;

@Service
@RequiredArgsConstructor
public class ExtendExpirationTimerService {

    private final RequestService requestService;
    private final RequestTaskTimeManagementService requestTaskTimeManagementService;

    public LocalDate extendTimer(final String requestId, final RequestExpirationType expirationType) {
        final Request request = requestService.findRequestById(requestId);
        final RequestPayloadRdeable requestPayload = (RequestPayloadRdeable) request.getPayload();
        final LocalDate extensionDate = requestPayload.getRdeData().getRdePayload().getExtensionDate();

        requestTaskTimeManagementService.setDueDateToTasks(requestId, expirationType, extensionDate);

        return extensionDate;
    }
}
