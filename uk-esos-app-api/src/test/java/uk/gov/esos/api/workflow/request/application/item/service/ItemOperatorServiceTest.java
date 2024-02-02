package uk.gov.esos.api.workflow.request.application.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppAuthority;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.authorization.OperatorAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemByRequestOperatorRepository;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.util.Collections.emptyMap;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class ItemOperatorServiceTest {

    @InjectMocks
    private ItemOperatorService itemService;

    @Mock
    private ItemResponseService itemResponseService;

    @Mock
    private ItemByRequestOperatorRepository itemByRequestOperatorRepository;

    @Mock
    private OperatorAuthorityResourceAdapter operatorAuthorityResourceAdapter;

    @Mock
    private RequestService requestService;

    @Test
    void getItemsByRequest() {
        final String requestId = "1";
        final Long accountId = 1L;
        final AccountType accountType = AccountType.ORGANISATION;
        final Request request = Request.builder().id(requestId).accountId(accountId).type(RequestType.ORGANISATION_ACCOUNT_OPENING).build();
        AppUser pmrvUser = buildOperatorUser("oper1Id", "oper1", "oper1", accountId);
        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypes = Map.of(accountId, Set.of());

        Item expectedItem = mock(Item.class);
        ItemPage expectedItemPage = ItemPage.builder()
                .items(List.of(expectedItem))
                .totalItems(1L)
                .build();
        ItemDTO expectedItemDTO = mock(ItemDTO.class);
        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
                .items(List.of(expectedItemDTO))
                .totalItems(1L)
                .build();

        // Mock
        doReturn(request).when(requestService).findRequestById(requestId);
        doReturn(scopedRequestTaskTypes)
            .when(operatorAuthorityResourceAdapter).getUserScopedRequestTaskTypesByAccountId(pmrvUser.getUserId(), accountId);
        doReturn(expectedItemPage).when(itemByRequestOperatorRepository).findItemsByRequestId(scopedRequestTaskTypes, requestId);
        doReturn(expectedItemDTOResponse).when(itemResponseService).toItemDTOResponse(expectedItemPage, accountType, pmrvUser);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemService.getItemsByRequest(pmrvUser, requestId);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
    }

    @Test
    void getItemsByRequest_empty_scopes() {
        final String requestId = "1";
        Long accountId = 1L;
        final Request request = Request.builder().id(requestId).accountId(accountId).build();
        AppUser pmrvUser = buildOperatorUser("oper1Id", "oper1", "oper1", accountId);
        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypesAsString = emptyMap();

        // Mock
        doReturn(request).when(requestService).findRequestById(requestId);
        doReturn(scopedRequestTaskTypesAsString)
            .when(operatorAuthorityResourceAdapter).getUserScopedRequestTaskTypesByAccountId(pmrvUser.getUserId(), accountId);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemService.getItemsByRequest(pmrvUser, requestId);

        // Assert
        assertEquals(ItemDTOResponse.emptyItemDTOResponse(), actualItemDTOResponse);

        verifyNoInteractions(itemByRequestOperatorRepository);
        verifyNoInteractions(itemResponseService);

        verify(operatorAuthorityResourceAdapter, times(1))
                .getUserScopedRequestTaskTypesByAccountId(pmrvUser.getUserId(), accountId);
    }

    @Test
    void getRoleType() {
        assertEquals(RoleType.OPERATOR, itemService.getRoleType());
    }

    private AppUser buildOperatorUser(String userId, String firstName, String lastName, Long accountId) {
        AppAuthority pmrvAuthority = AppAuthority.builder()
                .accountId(accountId).build();

        return AppUser.builder()
                .userId(userId)
                .firstName(firstName)
                .lastName(lastName)
                .authorities(List.of(pmrvAuthority))
                .roleType(RoleType.OPERATOR)
                .build();
    }
}
