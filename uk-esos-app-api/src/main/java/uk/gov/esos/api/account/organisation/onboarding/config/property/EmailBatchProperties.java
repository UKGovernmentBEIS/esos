package uk.gov.esos.api.account.organisation.onboarding.config.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "email.batch")
@Getter
@Setter
public class EmailBatchProperties {

	private Integer size;
	
	// The delay between two batches or two retries, in milliseconds
	private Long delay;
}
