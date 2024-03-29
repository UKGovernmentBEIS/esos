package uk.gov.esos.api.workflow.request.flow.esos.noc.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import uk.gov.esos.api.reporting.noc.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.RequestMetadata;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class NotificationOfComplianceRequestMetadata extends RequestMetadata {

    private Phase phase;
}
