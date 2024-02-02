package uk.gov.esos.api.user.core.service.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.keycloak.admin.client.Keycloak;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.esos.api.common.domain.provider.AppRestApi;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.common.config.KeycloakProperties;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakRestEndPointEnum;
import uk.gov.esos.api.user.core.domain.model.UserDetails;
import uk.gov.esos.api.user.core.domain.model.UserDetailsRequest;
import uk.gov.esos.api.user.core.domain.model.UserInfo;
import uk.gov.esos.api.user.core.domain.model.keycloak.KeycloakSignature;
import uk.gov.esos.api.user.core.domain.model.keycloak.KeycloakUserDetails;
import uk.gov.esos.api.user.core.domain.model.keycloak.KeycloakUserDetailsRequest;
import uk.gov.esos.api.user.core.domain.model.keycloak.KeycloakUserInfo;
import uk.gov.esos.api.user.core.domain.model.keycloak.KeycloakUserOtpValidationInfo;
import uk.gov.esos.api.user.core.transform.KeycloakUserMapper;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Component
@RequiredArgsConstructor
class KeycloakCustomClient {

    private final RestTemplate restTemplate;
    private final KeycloakProperties keycloakProperties;
    private final Keycloak keycloakAdminClient;
    private final KeycloakUserMapper keycloakUserMapper = Mappers.getMapper(KeycloakUserMapper.class);
    private final ObjectMapper objectMapper;

    public List<UserInfo> getUsers(List<String> userIds) {
        Optional<List<KeycloakUserInfo>> usersInfo = performGetUsersApiCall(userIds, false);
        return usersInfo.stream()
                .flatMap(Collection::stream)
                .map(keycloakUserMapper::toUserInfo)
                .collect(Collectors.toList());
    }

    public <T> List<T> getUsersWithAttributes(List<String> userIds, Class<T> attributesClazz) {
        Optional<List<KeycloakUserInfo>> usersInfo = performGetUsersApiCall(userIds, true);
        return usersInfo.stream()
                .flatMap(Collection::stream)
                .map(u -> objectMapper.convertValue(u, attributesClazz))
                .collect(Collectors.toList());
    }

    public Optional<UserDetails> getUserDetails(String userId) {
        if(userId == null) {
            return Optional.empty();
        }

        AppRestApi appRestApi = AppRestApi.builder()
                .uri(UriComponentsBuilder
                        .fromHttpUrl(realmEndpointUrl() + KeycloakRestEndPointEnum.KEYCLOAK_GET_USER_DETAILS.getEndPoint())
                        .queryParam("userId", userId)
                        .build())
                .restEndPoint(KeycloakRestEndPointEnum.KEYCLOAK_GET_USER_DETAILS)
                .headers(httpHeaders())
                .restTemplate(restTemplate)
                .build();

        ResponseEntity<KeycloakUserDetails> res;
        try{
            res = appRestApi.performApiCall();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

        Optional<KeycloakUserDetails> userDetails = res.getBody() == null ? Optional.empty()
                : Optional.of(res.getBody());

        return userDetails.map(u -> UserDetails.builder()
                .id(u.getId())
                .signature(u.getSignature())
                .build());
    }

    public void saveUserDetails(UserDetailsRequest userDetails) {
        AppRestApi appRestApi = AppRestApi.builder()
                .baseUrl(realmEndpointUrl())
                .restEndPoint(KeycloakRestEndPointEnum.KEYCLOAK_POST_USER_DETAILS)
                .headers(httpHeaders())
                .body(KeycloakUserDetailsRequest.builder()
                        .id(userDetails.getId())
                        .signature(userDetails.getSignature())
                        .build())
                .restTemplate(restTemplate)
                .build();

        try {
            appRestApi.performApiCall();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public Optional<FileDTO> getUserSignature(String signatureUuid) {
        if(signatureUuid == null) {
            return Optional.empty();
        }

        AppRestApi appRestApi = AppRestApi.builder()
                .uri(UriComponentsBuilder
                        .fromHttpUrl(realmEndpointUrl() + KeycloakRestEndPointEnum.KEYCLOAK_GET_USER_SIGNATURE.getEndPoint())
                        .queryParam("signatureUuid", signatureUuid)
                        .build())
                .restEndPoint(KeycloakRestEndPointEnum.KEYCLOAK_GET_USER_SIGNATURE)
                .headers(httpHeaders())
                .restTemplate(restTemplate)
                .build();

        ResponseEntity<KeycloakSignature> res;
        try{
            res = appRestApi.performApiCall();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

        Optional<KeycloakSignature> signature = res.getBody() == null ? Optional.empty()
                : Optional.of(res.getBody());

        return signature.map(s -> FileDTO.builder()
                .fileName(s.getName())
                .fileContent(s.getContent())
                .fileType(s.getType())
                .fileSize(s.getSize())
                .build());
    }

    public void validateAuthenticatedUserOtp(String otp, String token) {
        AppRestApi appRestApi = AppRestApi.builder()
                .baseUrl(realmEndpointUrl())
                .restEndPoint(KeycloakRestEndPointEnum.KEYCLOAK_VALIDATE_OTP)
                .headers(buildHttpHeadersWithAuthToken(token))
                .body(KeycloakUserOtpValidationInfo.builder().otp(otp).build())
                .restTemplate(restTemplate)
                .build();

        try {
            appRestApi.performApiCall();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_OTP, e);
        }
    }
    
    public void validateUnAuthenticatedUserOtp(String otp, String email) {
        AppRestApi appRestApi = AppRestApi.builder()
                .baseUrl(realmEndpointUrl())
                .restEndPoint(KeycloakRestEndPointEnum.KEYCLOAK_VALIDATE_OTP)
                .body(KeycloakUserOtpValidationInfo.builder().otp(otp).email(email).build())
                .restTemplate(restTemplate)
                .build();

        try {
            appRestApi.performApiCall();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_OTP, e);
        }
    }

    private Optional<List<KeycloakUserInfo>> performGetUsersApiCall(List<String> userIds, boolean includeAttributes) {
        if (userIds.isEmpty()) {
            return  Optional.empty();
        }

        AppRestApi appRestApi = AppRestApi.builder()
                .uri(UriComponentsBuilder
                        .fromHttpUrl(realmEndpointUrl() + KeycloakRestEndPointEnum.KEYCLOAK_GET_USERS.getEndPoint())
                        .queryParam("includeAttributes", includeAttributes)
                        .build())
                .restEndPoint(KeycloakRestEndPointEnum.KEYCLOAK_GET_USERS)
                .headers(httpHeaders())
                .body(userIds)
                .restTemplate(restTemplate)
                .build();

        ResponseEntity<List<KeycloakUserInfo>> res;
        try{
            res = appRestApi.performApiCall();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());
            throw new BusinessException(ErrorCode.INTERNAL_SERVER, e);
        }
        return res.getBody() == null ? Optional.empty() : Optional.of(res.getBody());
    }

    private String realmEndpointUrl() {
        return keycloakProperties.getAuthServerUrl()
                .concat("/realms/")
                .concat(keycloakProperties.getRealm());
    }

    private HttpHeaders httpHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(keycloakAdminClient.tokenManager().grantToken().getToken());
        return httpHeaders;
    }

    private HttpHeaders buildHttpHeadersWithAuthToken(String token) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(token);
        return httpHeaders;
    }
}
