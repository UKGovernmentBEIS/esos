package uk.gov.esos.api.workflow.request.flow.rde.handler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeData;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdePayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeSubmitRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RdeSubmittedRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.rde.domain.RequestPayloadRdeable;
import uk.gov.esos.api.workflow.request.flow.rde.mapper.RdeMapper;
import uk.gov.esos.api.workflow.request.flow.rde.service.RdeSendEventService;
import uk.gov.esos.api.workflow.request.flow.rde.service.RdeSubmitOfficialNoticeService;
import uk.gov.esos.api.workflow.request.flow.rde.validation.SubmitRdeValidatorService;

@Component
@RequiredArgsConstructor
public class RdeSubmitActionHandler implements RequestTaskActionHandler<RdeSubmitRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final UserAuthService userAuthService;
    private final SubmitRdeValidatorService validator;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private final RequestService requestService;
    private final RdeSendEventService rdeSendEventService;
    private final RdeSubmitOfficialNoticeService rdeSubmitOfficialNoticeService;
    
    private static final RdeMapper rdeMapper = Mappers.getMapper(RdeMapper.class);

    @Override
    public void process(Long requestTaskId, RequestTaskActionType requestTaskActionType, AppUser pmrvUser,
                        RdeSubmitRequestTaskActionPayload actionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final RdePayload rdePayload = actionPayload.getRdePayload();

        // Validate
        validator.validate(requestTask, rdePayload, pmrvUser);

        // Copy RDE request in request payload
        final Request request = requestTask.getRequest();
        final RequestPayloadRdeable requestPayload = (RequestPayloadRdeable) request.getPayload();
        requestPayload.setRdeData(RdeData.builder()
        		.rdePayload(rdePayload)
        		.currentDueDate(requestTask.getDueDate())
        		.build());
        
        final UserInfoDTO accountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
            .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        
        final List<String> ccRecipientsEmails = userAuthService.getUsers(new ArrayList<>(rdePayload.getOperators()))
                .stream().map(UserInfo::getEmail).collect(Collectors.toList());
        
        //generate official document file
        final FileInfoDTO officialDocument = rdeSubmitOfficialNoticeService.generateOfficialNotice(request,
                rdePayload.getSignatory(), accountPrimaryContact, ccRecipientsEmails);

        // Get users' information
        final Map<String, RequestActionUserInfo> usersInfo = requestActionUserInfoResolver
            .getUsersInfo(rdePayload.getOperators(), rdePayload.getSignatory(), request);

        // Create timeline action
        RdeSubmittedRequestActionPayload timelinePayload = rdeMapper.toRdeSubmittedRequestActionPayload(actionPayload, usersInfo, officialDocument);
        requestService.addActionToRequest(request, timelinePayload, RequestActionType.RDE_SUBMITTED, pmrvUser.getUserId());

        // Send RDE event
        rdeSendEventService.send(request.getId(), rdePayload.getDeadline());
        
        //send email notification
        rdeSubmitOfficialNoticeService.sendOfficialNotice(officialDocument, request, ccRecipientsEmails);
    }

    @Override
    public List<RequestTaskActionType> getTypes() {
        return List.of(RequestTaskActionType.RDE_SUBMIT);
    }
}
