package uk.gov.esos.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.common.domain.enumeration.RoleType;
import uk.gov.esos.api.workflow.request.application.authorization.VerifierAuthorityResourceAdapter;
import uk.gov.esos.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.esos.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemByRequestVerifierRepository;
import uk.gov.esos.api.workflow.request.application.item.repository.ItemVerifierRepository;
import uk.gov.esos.api.workflow.request.core.domain.Request;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;
import uk.gov.esos.api.workflow.request.core.service.RequestService;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemVerifierService implements ItemService {

    private final VerifierAuthorityResourceAdapter verifierAuthorityResourceAdapter;
    private final ItemResponseService itemResponseService;
    private final ItemByRequestVerifierRepository itemByRequestVerifierRepository;
    private final RequestService requestService;

    @Override
    public ItemDTOResponse getItemsByRequest(AppUser appUser, String requestId) {
        Request request = requestService.findRequestById(requestId);
        AccountType accountType = request.getType().getAccountType();

        Map<Long, Set<RequestTaskType>> scopedRequestTaskTypes = verifierAuthorityResourceAdapter
                .getUserScopedRequestTaskTypesByAccountType(appUser, accountType);

        if (ObjectUtils.isEmpty(scopedRequestTaskTypes)) {
            return ItemDTOResponse.emptyItemDTOResponse();
        }

        ItemPage itemPage = itemByRequestVerifierRepository.findItemsByRequestId(scopedRequestTaskTypes, requestId);

        return itemResponseService.toItemDTOResponse(itemPage, accountType, appUser);
    }

    @Override
    public RoleType getRoleType() {
        return RoleType.VERIFIER;
    }
}
