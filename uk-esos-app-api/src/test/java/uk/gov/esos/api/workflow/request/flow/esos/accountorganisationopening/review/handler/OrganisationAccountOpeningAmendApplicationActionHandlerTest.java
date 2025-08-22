package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountPayload;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountAmendService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;
import uk.gov.esos.api.workflow.request.core.domain.dto.OrganisationParticipantDetails;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskPayloadType;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskService;
import uk.gov.esos.api.workflow.request.core.service.RequestTaskValidationService;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountAmendPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.review.domain.OrganisationAccountOpeningApplicationRequestTaskPayload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningAmendApplicationActionHandlerTest {

    @InjectMocks
    private OrganisationAccountOpeningAmendApplicationActionHandler amendApplicationActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private OrganisationAccountAmendService organisationAccountAmendService;

    @Mock
    private RequestTaskValidationService requestTaskValidationService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        RequestTaskActionType requestTaskActionType = RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION;
        AppUser appUser = AppUser.builder().build();

        OrganisationAccountAmendPayload amendAccount = OrganisationAccountAmendPayload.builder()
            .name("updatedName")
            .address(CountyAddressDTO.builder().city("city").build())
            .build();

        OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload requestTaskActionPayload =
            OrganisationAccountOpeningAmendApplicationRequestTaskActionPayload.builder().accountPayload(amendAccount).build();

        Long accountId = 101L;
        Request request = Request.builder().accountId(accountId).build();
        OrganisationAccountPayload account = OrganisationAccountPayload.builder()
                .name("name")
                .registrationNumber("regNbr")
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .build();
        OrganisationParticipantDetails userDetails = OrganisationParticipantDetails.builder()
            .firstName("fname")
            .lastName("lname")
            .jobTitle("jobTitle")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("30").number("2109090908").build())
            .build();
        OrganisationAccountOpeningApplicationRequestTaskPayload requestTaskPayload =
            OrganisationAccountOpeningApplicationRequestTaskPayload.builder()
                .payloadType(RequestTaskPayloadType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_PAYLOAD)
                .account(account)
                .participantDetails(userDetails)
                .build();
        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .payload(requestTaskPayload)
            .build();

        final OrganisationAccountPayload updatedAccount = OrganisationAccountPayload.builder()
                .name("updatedName")
                .registrationNumber("regNbr")
                .competentAuthority(CompetentAuthorityEnum.WALES)
                .address(CountyAddressDTO.builder().city("city").build())
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        amendApplicationActionHandler.process(requestTaskId, requestTaskActionType, appUser, requestTaskActionPayload);

        //verify
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
        verify(organisationAccountAmendService, times(1)).amendAccount(eq(accountId), any(OrganisationAccountDTO.class));
        verify(requestTaskValidationService, times(1)).validateRequestTaskPayload(requestTaskPayload);

        assertEquals(updatedAccount, requestTaskPayload.getAccount());
        assertEquals(userDetails, requestTaskPayload.getParticipantDetails());
    }

    @Test
    void getTypes() {
        assertThat(amendApplicationActionHandler.getTypes())
            .containsOnly(RequestTaskActionType.ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION);
    }
}