package uk.gov.esos.api.web.orchestrator.authorization.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.enumeration.AccountContactType;
import uk.gov.esos.api.account.service.AccountContactQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthoritiesDTO;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityQueryService;
import uk.gov.esos.api.user.core.domain.dto.UserInfoDTO;
import uk.gov.esos.api.user.operator.service.OperatorUserInfoService;
import uk.gov.esos.api.web.orchestrator.authorization.dto.AccountOperatorsUsersAuthoritiesInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.dto.UserAuthorityInfoDTO;
import uk.gov.esos.api.web.orchestrator.authorization.transform.UserAuthorityInfoMapper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountOperatorUserAuthorityQueryOrchestrator {

    private final OperatorAuthorityQueryService operatorAuthorityQueryService;
    private final AccountContactQueryService accountContactQueryService;
    private final OperatorUserInfoService operatorUserInfoService;
    private final UserAuthorityInfoMapper userAuthorityInfoMapper = Mappers.getMapper(UserAuthorityInfoMapper.class);

    public AccountOperatorsUsersAuthoritiesInfoDTO getAccountOperatorsUsersAuthoritiesInfo(AppUser authUser, Long accountId) {
        UserAuthoritiesDTO accountAuthorities = operatorAuthorityQueryService.getAccountAuthorities(authUser, accountId);
        Map<AccountContactType, String> contactTypes = accountContactQueryService.findOperatorContactTypesByAccount(accountId);
        List<String> userIds = accountAuthorities.getAuthorities().stream().map(UserAuthorityDTO::getUserId).collect(Collectors.toList());
        List<UserInfoDTO> operatorUserInfo = operatorUserInfoService.getOperatorUsersInfo(authUser, accountId, userIds);

        return getAccountOperatorUserAuthoritiesInfoDTO(accountAuthorities, contactTypes, operatorUserInfo);
    }

    private AccountOperatorsUsersAuthoritiesInfoDTO getAccountOperatorUserAuthoritiesInfoDTO(
        UserAuthoritiesDTO accountAuthorities,
            Map<AccountContactType, String> contactTypes,
            List<UserInfoDTO> operatorUserInfo) {

        List<UserAuthorityInfoDTO> accountUserAuthorities =
        accountAuthorities.getAuthorities().stream()
                .map(authority ->
                        userAuthorityInfoMapper.toUserAuthorityInfo(
                                authority,
                                operatorUserInfo.stream()
                                        .filter(info -> info.getUserId().equals(authority.getUserId()))
                                        .findFirst()
                                        .orElse(new UserInfoDTO())))
        .collect(Collectors.toList());

        return AccountOperatorsUsersAuthoritiesInfoDTO.builder()
                .authorities(accountUserAuthorities)
                .editable(accountAuthorities.isEditable())
                .contactTypes(contactTypes)
                .build();
    }
}
