package uk.gov.esos.api.account.client.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.esos.api.account.client.config.CompanyInformationServiceProperties;
import uk.gov.esos.api.account.client.domain.CompanyProfile;
import uk.gov.esos.api.account.client.domain.dto.CompanyProfileDTO;
import uk.gov.esos.api.account.client.domain.enumeration.CompanyInformationRestEndPointEnum;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyInformationServiceTest {

    @InjectMocks
    private CompanyInformationService companyInformationService;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private CompanyInformationServiceProperties companyInformationServiceProperties;

    @Test
    void getCompanyProfile() {
        String registrationNumber = "12345678";
        String apiKey = "key";
        String url = "http://www.google.gr/";

        CompanyProfile companyProfile = CompanyProfile.builder()
            .name("name")
            .registrationNumber(registrationNumber)
            .status("active")
            .sicCodes(List.of("12345"))
            .build();

        CompanyProfileDTO expectedCompanyProfileDTO = CompanyProfileDTO.builder()
            .name("name")
            .registrationNumber(registrationNumber)
            .sicCodes(List.of("12345"))
            .build();

        String restPoint = UriComponentsBuilder
            .fromHttpUrl(url)
            .path(CompanyInformationRestEndPointEnum.GET_COMPANY_PROFILE.getEndPoint())
            .buildAndExpand(registrationNumber)
            .toString();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBasicAuth(apiKey, "");

        when(companyInformationServiceProperties.getApiKey()).thenReturn(apiKey);
        when(companyInformationServiceProperties.getUrl()).thenReturn(url);
        when(restTemplate.exchange(restPoint, HttpMethod.GET, new HttpEntity<>(httpHeaders),
            new ParameterizedTypeReference<CompanyProfile>() {}, new HashMap<>()))
            .thenReturn(new ResponseEntity<CompanyProfile>(companyProfile, HttpStatus.OK));

        // Invoke
        CompanyProfileDTO actualCompanyProfileDTO = companyInformationService.getCompanyProfile(registrationNumber);

        // Verify
        assertEquals(expectedCompanyProfileDTO, actualCompanyProfileDTO);
    }

    @Test
    void getCompanyProfile_throws_exception_when_company_not_found() {
        String registrationNumber = "12345678";
        String apiKey = "key";
        String url = "http://www.google.gr/";

        String restPoint = UriComponentsBuilder
            .fromHttpUrl(url)
            .path(CompanyInformationRestEndPointEnum.GET_COMPANY_PROFILE.getEndPoint())
            .buildAndExpand(registrationNumber)
            .toString();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBasicAuth(apiKey, "");

        when(companyInformationServiceProperties.getApiKey()).thenReturn(apiKey);
        when(companyInformationServiceProperties.getUrl()).thenReturn(url);
        when(restTemplate.exchange(restPoint, HttpMethod.GET, new HttpEntity<>(httpHeaders),
            new ParameterizedTypeReference<CompanyProfile>() {}, new HashMap<>()))
            .thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
            () -> companyInformationService.getCompanyProfile(registrationNumber));

        // Verify
        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, businessException.getErrorCode());
    }

    @Test
    void getCompanyProfile_throws_exception() {
        String registrationNumber = "12345678";
        String apiKey = "key";
        String url = "http://www.google.gr/";

        String restPoint = UriComponentsBuilder
            .fromHttpUrl(url)
            .path(CompanyInformationRestEndPointEnum.GET_COMPANY_PROFILE.getEndPoint())
            .buildAndExpand(registrationNumber)
            .toString();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBasicAuth(apiKey, "");

        when(companyInformationServiceProperties.getApiKey()).thenReturn(apiKey);
        when(companyInformationServiceProperties.getUrl()).thenReturn(url);
        when(restTemplate.exchange(restPoint, HttpMethod.GET, new HttpEntity<>(httpHeaders),
            new ParameterizedTypeReference<CompanyProfile>() {}, new HashMap<>()))
            .thenThrow(new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
            () -> companyInformationService.getCompanyProfile(registrationNumber));

        // Verify
        assertEquals(ErrorCode.UNAVAILABLE_CH_API, businessException.getErrorCode());
    }
}