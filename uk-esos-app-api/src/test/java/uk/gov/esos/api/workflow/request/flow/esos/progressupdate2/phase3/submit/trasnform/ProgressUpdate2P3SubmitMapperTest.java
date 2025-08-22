package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.submit.trasnform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Container;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

class ProgressUpdate2P3SubmitMapperTest {

    private final ProgressUpdate2P3SubmitMapper mapper = Mappers.getMapper(ProgressUpdate2P3SubmitMapper.class);

    @Test
    void toPu2P3Container() {
        Phase phase = Phase.PHASE_3;
        ProgressUpdate2P3 pu1p3 = ProgressUpdate2P3.builder()
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        ProgressUpdate2P3RequestPayload requestPayload =
                ProgressUpdate2P3RequestPayload.builder()
                        .progressUpdate2P3(pu1p3)
                        .build();

        ProgressUpdate2P3Container expected = ProgressUpdate2P3Container.builder().progressUpdate2P3(pu1p3).phase(phase).build();

        ProgressUpdate2P3Container actual = mapper.toProgressUpdate2P3Container(requestPayload, phase);

        assertEquals(expected, actual);
    }

}