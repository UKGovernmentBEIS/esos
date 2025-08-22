package uk.gov.esos.api.account.client.domain.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import uk.gov.esos.api.account.client.domain.CompanyProfile;
import uk.gov.esos.api.common.domain.provider.RestEndPoint;

import java.util.List;

@Getter
@AllArgsConstructor
public enum CompanyInformationRestEndPointEnum implements RestEndPoint {

    GET_COMPANY_PROFILE("/company/{companyNumber}", HttpMethod.GET, new ParameterizedTypeReference<CompanyProfile>() {}, List.of("companyNumber"));

    private final String endPoint;

    private final HttpMethod method;

    private final ParameterizedTypeReference<?> parameterizedTypeReference;

    private final List<String> parameters;
}
