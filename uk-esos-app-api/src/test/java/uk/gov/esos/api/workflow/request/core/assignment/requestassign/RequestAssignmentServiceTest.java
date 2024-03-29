package uk.gov.esos.api.workflow.request.core.assignment.requestassign;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.common.domain.OrganisationAccountOpeningRequestPayload;

@ExtendWith(MockitoExtension.class)
class RequestAssignmentServiceTest {
    
    @InjectMocks
    private RequestAssignmentService service;
    
    @Mock
    private UserRoleTypeService userRoleTypeService;

    @Test
    void assignRequestToUser_operator_candidate_assignee() {
        final String operatorAssignee = "operatorAssignee";
        final String candidateAssignee = "candidateAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().operatorAssignee(operatorAssignee).build())
            .build();
        UserRoleTypeDTO candidateAssigneeRoleType = UserRoleTypeDTO.builder()
            .userId(candidateAssignee)
            .roleType(RoleType.OPERATOR)
            .build();

        when(userRoleTypeService.getUserRoleTypeByUserId(candidateAssignee)).thenReturn(candidateAssigneeRoleType);

        service.assignRequestToUser(request, candidateAssignee);
        assertEquals(candidateAssignee, request.getPayload().getOperatorAssignee());

        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(candidateAssignee);
    }

    @Test
    void assignRequestToUser_candidate_assignee_is_already_operator_assignee() {
        final String operatorAssignee = "operatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().operatorAssignee(operatorAssignee).build())
            .build();
        UserRoleTypeDTO candidateAssigneeRoleType = UserRoleTypeDTO.builder()
            .userId(operatorAssignee)
            .roleType(RoleType.OPERATOR)
            .build();

        when(userRoleTypeService.getUserRoleTypeByUserId(operatorAssignee)).thenReturn(candidateAssigneeRoleType);

        service.assignRequestToUser(request, operatorAssignee);

        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(operatorAssignee);
    }

    @Test
    void assignRequestToUser_regulator_candidate_assignee() {
        final String regulatorAssignee = "regulatorAssignee";
        final String candidateAssignee = "candidateAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().regulatorAssignee(regulatorAssignee).build())
            .build();
        UserRoleTypeDTO candidateAssigneeRoleType = UserRoleTypeDTO.builder()
            .userId(candidateAssignee)
            .roleType(RoleType.REGULATOR)
            .build();

        when(userRoleTypeService.getUserRoleTypeByUserId(candidateAssignee)).thenReturn(candidateAssigneeRoleType);

        service.assignRequestToUser(request, candidateAssignee);
        assertEquals(candidateAssignee, request.getPayload().getRegulatorAssignee());

        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(candidateAssignee);
    }

    @Test
    void assignRequestToUser_candidate_assignee_is_already_regulator_assignee() {
        final String regulatorAssignee = "regulatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().regulatorAssignee(regulatorAssignee).build())
            .build();
        UserRoleTypeDTO candidateAssigneeRoleType = UserRoleTypeDTO.builder()
            .userId(regulatorAssignee)
            .roleType(RoleType.REGULATOR)
            .build();

        when(userRoleTypeService.getUserRoleTypeByUserId(regulatorAssignee)).thenReturn(candidateAssigneeRoleType);

        service.assignRequestToUser(request, regulatorAssignee);

        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(regulatorAssignee);
    }

    @Test
    void assignRequestToUser_candidate_assignee_is_null() {
        final String operatorAssignee = "operatorAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().operatorAssignee(operatorAssignee).build())
            .build();

        BusinessException businessException =
            assertThrows(BusinessException.class, () -> service.assignRequestToUser(request, null));

        assertEquals(ErrorCode.ASSIGNMENT_NOT_ALLOWED, businessException.getErrorCode());
    }

    @Test
    void assignRequestToUser_verifier_is_already_verifier_assignee() {
        final String verifierAssignee = "verifierAssignee";
        Request request = Request.builder()
            .payload(OrganisationAccountOpeningRequestPayload.builder().verifierAssignee(verifierAssignee).build())
            .build();
        UserRoleTypeDTO candidateAssigneeRoleType = UserRoleTypeDTO.builder()
            .userId(verifierAssignee)
            .roleType(RoleType.VERIFIER)
            .build();

        when(userRoleTypeService.getUserRoleTypeByUserId(verifierAssignee)).thenReturn(candidateAssigneeRoleType);

        service.assignRequestToUser(request, verifierAssignee);

        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(verifierAssignee);
    }

    @Test
    void assignRequestToUser_verifier_candidate_assignee() {
        final String verifierAssignee = "verifierAssignee";
        final String candidateAssignee = "candidateAssignee";
        Request request = Request.builder()
                .payload(OrganisationAccountOpeningRequestPayload.builder().verifierAssignee(verifierAssignee).build())
                .build();
        UserRoleTypeDTO candidateAssigneeRoleType = UserRoleTypeDTO.builder()
                .userId(candidateAssignee)
                .roleType(RoleType.VERIFIER)
                .build();

        when(userRoleTypeService.getUserRoleTypeByUserId(candidateAssignee)).thenReturn(candidateAssigneeRoleType);

        service.assignRequestToUser(request, candidateAssignee);
        assertEquals(candidateAssignee, request.getPayload().getVerifierAssignee());

        verify(userRoleTypeService, times(1)).getUserRoleTypeByUserId(candidateAssignee);
    }
}
