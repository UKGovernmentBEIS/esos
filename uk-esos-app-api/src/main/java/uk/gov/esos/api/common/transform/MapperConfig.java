package uk.gov.esos.api.common.transform;

import org.mapstruct.Builder;

/**
 * Configuration source for custom mappers.
 */
@org.mapstruct.MapperConfig(builder = @Builder(disableBuilder = true))
public interface MapperConfig {
}
