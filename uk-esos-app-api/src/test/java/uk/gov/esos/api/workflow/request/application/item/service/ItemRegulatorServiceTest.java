package uk.gov.esos.api.workflow.request.application.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.authorization.RegulatorAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.Item;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemByRequestRegulatorRepository;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.esos.api.competentauthority.CompetentAuthorityEnum.ENGLAND;
import static uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType.ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW;

@ExtendWith(MockitoExtension.class)
class ItemRegulatorServiceTest {

    @InjectMocks
    private ItemRegulatorService itemService;

    @Mock
    private ItemResponseService itemResponseService;

    @Mock
    private ItemByRequestRegulatorRepository itemByRequestRegulatorRepository;

    @Mock
    private RegulatorAuthorityResourceAdapter regulatorAuthorityResourceAdapter;

    @Mock
    private RequestService requestService;

    @Test
    void getItemsByRequest() {
        final String requestId = "1";
        final Long accountId = 1L;
        final Request request = Request.builder().id(requestId).accountId(accountId).type(RequestType.ORGANISATION_ACCOUNT_OPENING).build();
        final AccountType accountType = AccountType.ORGANISATION;
        Map<CompetentAuthorityEnum, Set<RequestTaskType>> scopedRequestTaskTypes =
                Map.of(ENGLAND, Set.of(ORGANISATION_ACCOUNT_OPENING_APPLICATION_REVIEW));

        AppUser pmrvUser = buildRegulatorUser("reg1Id");
        Item expectedItem = mock(Item.class);
        ItemPage expectedItemPage = ItemPage.builder()
                .items(List.of(expectedItem))
                .totalItems(1L).build();
        ItemDTO expectedItemDTO = mock(ItemDTO.class);
        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
                .items(List.of(expectedItemDTO))
                .totalItems(1L).build();

        // Mock
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(regulatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(pmrvUser.getUserId(), accountType))
                .thenReturn(scopedRequestTaskTypes);
        doReturn(expectedItemPage).when(itemByRequestRegulatorRepository).findItemsByRequestId(scopedRequestTaskTypes, requestId);
        doReturn(expectedItemDTOResponse).when(itemResponseService).toItemDTOResponse(expectedItemPage, accountType, pmrvUser);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemService.getItemsByRequest(pmrvUser, requestId);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(regulatorAuthorityResourceAdapter, times(1))
                .getUserScopedRequestTaskTypesByAccountType(pmrvUser.getUserId(), accountType);
        verify(itemByRequestRegulatorRepository, times(1))
                .findItemsByRequestId(scopedRequestTaskTypes, requestId);
        verify(itemResponseService, times(1))
                .toItemDTOResponse(expectedItemPage, accountType, pmrvUser);
    }

    @Test
    void getItemsByRequest_empty_scopes() {
        final String requestId = "1";
        final Long accountId = 2L;
        final Request request = Request.builder().id(requestId).accountId(accountId).type(RequestType.ORGANISATION_ACCOUNT_OPENING).build();
        final AccountType accountType = AccountType.ORGANISATION;
        Map<CompetentAuthorityEnum, Set<RequestTaskType>> scopedRequestTaskTypes = Map.of();
        AppUser pmrvUser = buildRegulatorUser("reg1Id");

        // Mock
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(regulatorAuthorityResourceAdapter.getUserScopedRequestTaskTypesByAccountType(pmrvUser.getUserId(), accountType))
                .thenReturn(scopedRequestTaskTypes);

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemService.getItemsByRequest(pmrvUser, requestId);

        // Assert
        assertThat(actualItemDTOResponse).isEqualTo(ItemDTOResponse.emptyItemDTOResponse());

        verify(requestService, times(1)).findRequestById(requestId);
        verify(regulatorAuthorityResourceAdapter, times(1))
            .getUserScopedRequestTaskTypesByAccountType(pmrvUser.getUserId(), accountType);
        verify(itemByRequestRegulatorRepository, never()).findItemsByRequestId(Mockito.anyMap(), Mockito.anyString());
        verify(itemResponseService, never()).toItemDTOResponse(Mockito.any(), Mockito.any(), Mockito.any());
    }

    @Test
    void getRoleType() {
        assertEquals(RoleType.REGULATOR, itemService.getRoleType());
    }

    private AppUser buildRegulatorUser(String userId) {
        return AppUser.builder()
                .userId(userId)
                .roleType(RoleType.REGULATOR)
                .build();
    }
}
