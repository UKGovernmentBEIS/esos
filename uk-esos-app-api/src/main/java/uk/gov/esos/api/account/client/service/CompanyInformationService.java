package uk.gov.esos.api.account.client.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.esos.api.account.client.config.CompanyInformationServiceProperties;
import uk.gov.esos.api.account.client.domain.CompanyProfile;
import uk.gov.esos.api.account.client.domain.dto.CompanyProfileDTO;
import uk.gov.esos.api.account.client.domain.enumeration.CompanyInformationRestEndPointEnum;
import uk.gov.esos.api.account.client.transform.CompanyInformationMapper;
import uk.gov.esos.api.common.domain.provider.AppRestApi;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@Log4j2
@Service
@RequiredArgsConstructor
public class CompanyInformationService {

    private final RestTemplate restTemplate;

    private final CompanyInformationServiceProperties companyInformationServiceProperties;

    private static final CompanyInformationMapper COMPANY_INFORMATION_MAPPER = Mappers.getMapper(CompanyInformationMapper.class);

    public CompanyProfileDTO getCompanyProfile(String registrationNumber) {
        CompanyProfile companyProfile = performGetCompanyProfileApiCall(registrationNumber);
        return COMPANY_INFORMATION_MAPPER.toCompanyProfileDTO(companyProfile);
    }

    private CompanyProfile performGetCompanyProfileApiCall(String registrationNumber) {
        AppRestApi appRestApi = AppRestApi.builder()
                .uri(UriComponentsBuilder
                        .fromHttpUrl(companyInformationServiceProperties.getUrl())
                        .path(CompanyInformationRestEndPointEnum.GET_COMPANY_PROFILE.getEndPoint())
                        .buildAndExpand(registrationNumber)
                )
                .restEndPoint(CompanyInformationRestEndPointEnum.GET_COMPANY_PROFILE)
                .headers(buildHttpHeaders())
                .restTemplate(restTemplate)
                .build();

        try {
            ResponseEntity<CompanyProfile> apiResponse = appRestApi.performApiCall();
            return apiResponse.getBody();
        } catch (HttpClientErrorException e) {
            log.error(e.getMessage());

            HttpStatusCode statusCode = e.getStatusCode();

            if (HttpStatus.NOT_FOUND.equals(statusCode)) {
                throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, registrationNumber);
            } else if (HttpStatus.UNAUTHORIZED.equals(statusCode)) {
                throw new BusinessException(ErrorCode.UNAUTHORIZED_CH_API, e);
            } else if (HttpStatus.TOO_MANY_REQUESTS.equals(statusCode)) {
                throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS_CH_API, e);
            } else {
                throw new BusinessException(ErrorCode.UNAVAILABLE_CH_API, e);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new BusinessException(ErrorCode.UNAVAILABLE_CH_API, e);
        }
    }

    private HttpHeaders buildHttpHeaders() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBasicAuth(companyInformationServiceProperties.getApiKey(), "");
        return httpHeaders;
    }
}
