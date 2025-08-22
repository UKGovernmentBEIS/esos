package uk.gov.esos.api.mireport.organisation.executedactions;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestAction;
import uk.gov.esos.api.mireport.common.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.RequestAction;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class, OrganisationExecutedRequestActionsRepository.class})
class OrganisationExecutedRequestActionsRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    private OrganisationExecutedRequestActionsRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void findRequestActionsByCaAndParams_resultes_when_only_mandatory_parameters_applied(){
        OrganisationAccount acc1 = createAccount(1L,"account", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.WALES);
        Request acc1InstAccOpenRequest = createRequest(acc1, "NEW1", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED);
        createRequestAction(acc1InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 5, 12, 30 ),
            "operator");
        RequestAction acc1InstAccOpenRequestApproved = createRequestAction(acc1InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED,
            LocalDateTime.of(2022, 1, 6, 15, 45 ),
            "regulator");

        OrganisationAccount acc2 = createAccount(2L,"account2", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.ENGLAND);
        Request acc2InstAccOpenRequest = createRequest(acc2, "NEW2", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS);
        createRequestAction(acc2InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 5, 22, 30 ),
            "operator");
        RequestAction acc2InstAccOpenRequestApproved = createRequestAction(acc2InstAccOpenRequest,
                RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED,
                LocalDateTime.of(2022, 1, 10, 15, 45 ),
                "regulator");

        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
            .reportType(MiReportType.COMPLETED_WORK)
            .fromDate(LocalDate.of(2022,1,6))
            .build();

        List<ExecutedRequestAction> actions = repository.findExecutedRequestActions(entityManager, reportParams);

        assertThat(actions).isNotEmpty();
        assertThat(actions).hasSize(2);

        ExecutedRequestAction executedRequestAction = actions.get(0);
        assertEquals(acc1.getOrganisationId(), executedRequestAction.getOrganisationId());
        assertEquals(acc1.getAccountType(), executedRequestAction.getAccountType());
        assertEquals(acc1.getStatus().getName(), executedRequestAction.getAccountStatus());
        assertEquals(acc1.getName(), executedRequestAction.getAccountName());
        assertEquals(acc1.getName(), executedRequestAction.getAccountName());
        assertEquals(acc1InstAccOpenRequest.getId(), executedRequestAction.getRequestId());
        assertEquals(acc1InstAccOpenRequest.getType(), executedRequestAction.getRequestType());
        assertEquals(acc1InstAccOpenRequest.getStatus(), executedRequestAction.getRequestStatus());
        assertEquals(acc1InstAccOpenRequestApproved.getType(), executedRequestAction.getRequestActionType());
        assertEquals(acc1InstAccOpenRequestApproved.getSubmitter(), executedRequestAction.getRequestActionSubmitter());
        assertEquals(acc1InstAccOpenRequestApproved.getCreationDate().truncatedTo(ChronoUnit.MILLIS),
            executedRequestAction.getRequestActionCompletionDate().truncatedTo(ChronoUnit.MILLIS));

        executedRequestAction = actions.get(1);
        assertEquals(acc2.getOrganisationId(), executedRequestAction.getOrganisationId());
        assertEquals(acc2.getAccountType(), executedRequestAction.getAccountType());
        assertEquals(acc2.getStatus().getName(), executedRequestAction.getAccountStatus());
        assertEquals(acc2.getName(), executedRequestAction.getAccountName());
        assertEquals(acc2.getName(), executedRequestAction.getAccountName());
        assertEquals(acc2InstAccOpenRequest.getId(), executedRequestAction.getRequestId());
        assertEquals(acc2InstAccOpenRequest.getType(), executedRequestAction.getRequestType());
        assertEquals(acc2InstAccOpenRequest.getStatus(), executedRequestAction.getRequestStatus());
        assertEquals(acc2InstAccOpenRequestApproved.getType(), executedRequestAction.getRequestActionType());
        assertEquals(acc2InstAccOpenRequestApproved.getSubmitter(), executedRequestAction.getRequestActionSubmitter());
        assertEquals(acc2InstAccOpenRequestApproved.getCreationDate().truncatedTo(ChronoUnit.MILLIS),
                executedRequestAction.getRequestActionCompletionDate().truncatedTo(ChronoUnit.MILLIS));
    }

    @Test
    void findRequestActionsByCaAndParams_results_when_all_parameters_applied(){
        OrganisationAccount acc1 = createAccount(1L,"account", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.WALES);
        Request acc1InstAccOpenRequest = createRequest(acc1, "NEW1", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED);
        createRequestAction(acc1InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 5, 0, 0 ),
            "operator");
        createRequestAction(acc1InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED,
            LocalDateTime.of(2022, 1, 6, 15, 45 ),
            "regulator");

        OrganisationAccount acc2 = createAccount(2L,"account2", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.WALES);
        Request acc2InstAccOpenRequest = createRequest(acc2, "NEW2", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.IN_PROGRESS);
        createRequestAction(acc2InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 10, 0, 30 ),
            "operator");

        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
            .reportType(MiReportType.COMPLETED_WORK)
            .fromDate(LocalDate.of(2022,1,5))
            .toDate(LocalDate.of(2022,1,10))
            .build();

        List<ExecutedRequestAction> actions = repository.findExecutedRequestActions(entityManager, reportParams);

        assertThat(actions).isNotEmpty();
        assertThat(actions).hasSize(2);
        assertThat(actions).extracting(ExecutedRequestAction::getOrganisationId).containsOnly(acc1.getOrganisationId());
    }

    @Test
    void findRequestActionsByCaAndParams_results_fetched_on_requested_order() {
        OrganisationAccount acc1 = createAccount(1L,"account1", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.WALES);
        Request acc1InstAccOpenRequest1 = createRequest(acc1, "NEW1", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED);
        RequestAction acc1InstAccOpenRequest1Submitted = createRequestAction(acc1InstAccOpenRequest1,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 1, 12, 30 ),
            "operator");
        RequestAction acc1InstAccOpenRequest1Approved = createRequestAction(acc1InstAccOpenRequest1,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED,
            LocalDateTime.of(2022, 1, 3, 15, 45 ),
            "regulator");

        OrganisationAccount acc2 = createAccount(2L,"account2", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.WALES);
        Request acc2InstAccOpenRequest = createRequest(acc2, "NEW3", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED);
        createRequestAction(acc2InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 2, 0, 0 ),
            "operator");
        createRequestAction(acc2InstAccOpenRequest,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPROVED,
            LocalDateTime.of(2022, 1, 6, 11, 0 ),
            "regulator");

        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
            .reportType(MiReportType.COMPLETED_WORK)
            .fromDate(LocalDate.of(2022,1,1))
            .build();

        List<ExecutedRequestAction> actions = repository.findExecutedRequestActions(entityManager, reportParams);

        assertThat(actions).isNotEmpty();
        assertThat(actions).hasSize(4);
        assertThat(actions).extracting(ExecutedRequestAction::getOrganisationId)
            .containsExactly(acc1.getOrganisationId(), acc1.getOrganisationId(), acc2.getOrganisationId(), acc2.getOrganisationId());
        assertThat(actions)
            .filteredOn(action -> action.getOrganisationId().equals(acc1.getOrganisationId()))
            .extracting(ExecutedRequestAction::getRequestType)
            .containsExactly(
                RequestType.ORGANISATION_ACCOUNT_OPENING,
                RequestType.ORGANISATION_ACCOUNT_OPENING
            );
        assertThat(actions)
            .filteredOn(action -> action.getOrganisationId().equals(acc1.getOrganisationId())
                && action.getRequestType().equals(RequestType.ORGANISATION_ACCOUNT_OPENING)
            )
            .extracting(ExecutedRequestAction::getRequestId)
            .containsExactly(
                acc1InstAccOpenRequest1.getId(),
                acc1InstAccOpenRequest1.getId()
            );
        assertThat(actions)
            .filteredOn(action -> action.getOrganisationId().equals(acc1.getOrganisationId())
                && action.getRequestType().equals(RequestType.ORGANISATION_ACCOUNT_OPENING)
                && action.getRequestId().equals(acc1InstAccOpenRequest1.getId())
            )
            .extracting(ExecutedRequestAction::getRequestActionCompletionDate)
            .containsExactly(
                acc1InstAccOpenRequest1Submitted.getCreationDate(),
                acc1InstAccOpenRequest1Approved.getCreationDate()
            );
    }

    @Test
    void findRequestActionsByCaAndParams_no_results(){
        OrganisationAccount account = createAccount(1L,"account", OrganisationAccountStatus.LIVE, CompetentAuthorityEnum.WALES);
        Request request = createRequest(account, "NEW1", RequestType.ORGANISATION_ACCOUNT_OPENING, RequestStatus.COMPLETED);
        createRequestAction(request,
            RequestActionType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED,
            LocalDateTime.of(2022, 1, 15, 12, 30 ),
            "operator");

        ExecutedRequestActionsMiReportParams reportParams = ExecutedRequestActionsMiReportParams.builder()
            .reportType(MiReportType.COMPLETED_WORK)
            .fromDate(LocalDate.of(2022,1,16))
            .build();

        List<ExecutedRequestAction> executedRequestActions =
            repository.findExecutedRequestActions(entityManager, reportParams);

        assertThat(executedRequestActions).isEmpty();
    }

    private OrganisationAccount createAccount(Long id, String name, OrganisationAccountStatus status, CompetentAuthorityEnum competentAuthority) {

        OrganisationAccount account = OrganisationAccount.builder()
            .id(id)
            .name(name)
            .status(status)
            .accountType(AccountType.ORGANISATION)
            .competentAuthority(competentAuthority)
            .organisationId("ORG" + String.format("%06d", id))
            .address(CountyAddress.builder()
                .line1("line 1")
                .city("London")
                .county("Essex")
                .postcode("42901")
                .build())
            .location(competentAuthority)
            .build();

        entityManager.persist(account);
        return account;
    }

    private Request createRequest(Account account, String requestId, RequestType type, RequestStatus status) {
        Request request = Request.builder()
            .id(requestId)
            .type(type)
            .status(status)
            .accountId(account.getId())
            .competentAuthority(account.getCompetentAuthority())
            .build();

        entityManager.persist(request);
        return request;
    }

    private RequestAction createRequestAction(Request request, RequestActionType type, LocalDateTime creationDate, String submitter) {
        RequestAction requestAction = RequestAction.builder()
            .request(request)
            .type(type)
            .submitter(submitter)
            .build();

        entityManager.persist(requestAction);

        requestAction.setCreationDate(creationDate);
        entityManager.merge(requestAction);

        return requestAction;
    }
}