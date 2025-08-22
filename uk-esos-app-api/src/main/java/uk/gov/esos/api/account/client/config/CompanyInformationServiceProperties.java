package uk.gov.esos.api.account.client.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@Data
@ConfigurationProperties(prefix = "company-information-service")
public class CompanyInformationServiceProperties {

    @NotBlank
    private String url;

    @NotBlank
    private String apiKey;
}
