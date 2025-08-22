package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.trasnform;

import org.mapstruct.Mapper;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Container;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ProgressUpdate2P3SubmitMapper {

    ProgressUpdate2P3Container toProgressUpdate2P3Container(ProgressUpdate2P3RequestPayload requestPayload, Phase phase);
}
