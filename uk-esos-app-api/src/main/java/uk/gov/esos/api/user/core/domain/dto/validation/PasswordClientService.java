package uk.gov.esos.api.user.core.domain.dto.validation;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import uk.gov.esos.api.common.config.AppProperties;
import uk.gov.esos.api.common.domain.provider.AppRestApi;
import uk.gov.esos.api.user.core.domain.enumeration.RestEndPointEnum;

import java.util.Collections;
import java.util.List;

/**
 *  The client for https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
@Service
public class PasswordClientService {

    /** The {@link RestTemplate} */
    private final RestTemplate restTemplate;

    /** The {@link AppProperties} */
    private final AppProperties appProperties;

    /**
     * The PasswordClient constructor
     *
     * @param restTemplate {@link RestTemplate}
     * @param appProperties {@link AppProperties}
     */
    public PasswordClientService(
            RestTemplate restTemplate,
            AppProperties appProperties) {
        this.restTemplate = restTemplate;
        this.appProperties = appProperties;
    }

    /**
     * Call to https://api.pwnedpasswords.com/range/{passwordHash} API
     *
     * @param passwordHash first 5 digits of password hash
     * @return list of password hash suffixes that match the input along with their occurrences
     * e.g. 1AA8423017483440CC271B810DEB524E139:5454
     */
    public String searchPassword(String passwordHash) {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setAccept(Collections.singletonList(MediaType.parseMediaType("text/plain")));

        AppRestApi appRestApi = AppRestApi.builder()
                .baseUrl(appProperties.getClient().getPasswordUrl())
                .restEndPoint(RestEndPointEnum.PWNED_PASSWORDS)
                .headers(httpHeaders)
                .requestParams(List.of(passwordHash))
                .restTemplate(restTemplate)
                .build();

        ResponseEntity<String> res = appRestApi.performApiCall();

        return res.getBody();
    }

}