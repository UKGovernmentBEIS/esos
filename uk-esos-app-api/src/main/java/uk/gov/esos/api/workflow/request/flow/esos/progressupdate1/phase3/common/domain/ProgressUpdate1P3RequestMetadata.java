package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.RequestMetadata;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProgressUpdate1P3RequestMetadata  extends RequestMetadata {

    private Phase phase;
}
