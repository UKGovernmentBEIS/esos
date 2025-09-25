package uk.gov.esos.api.common.config.cloudwatch;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotEmpty;

@Validated
@ConfigurationProperties(prefix = "cloudwatch")
@Getter
@Setter
public class CloudWatchProperties {
    @NotEmpty
    private String enabled;

    @NotEmpty
    private String namespace;

    @NotEmpty
    private String batchSize;

    @NotEmpty
    private String step;

    @NotEmpty
    private String region;

    @NotEmpty
    private String awsEndpointUrl;
}
