package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.transform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ProgressUpdate1P3SubmitMapper {

    ProgressUpdate1P3Container toProgressUpdate1P3Container(ProgressUpdate1P3RequestPayload requestPayload, Phase phase);

}
