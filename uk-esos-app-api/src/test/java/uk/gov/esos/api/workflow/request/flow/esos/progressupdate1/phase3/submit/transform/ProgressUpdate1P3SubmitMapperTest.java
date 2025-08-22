package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.submit.transform;


import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

class ProgressUpdate1P3SubmitMapperTest {

    private final ProgressUpdate1P3SubmitMapper mapper = Mappers.getMapper(ProgressUpdate1P3SubmitMapper.class);

    @Test
    void toPu1P3Container() {
        Phase phase = Phase.PHASE_3;
        ProgressUpdate1P3 pu1p3 = ProgressUpdate1P3.builder()
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        ProgressUpdate1P3RequestPayload requestPayload =
                ProgressUpdate1P3RequestPayload.builder()
                        .progressUpdate1P3(pu1p3)
                        .build();

        ProgressUpdate1P3Container expected = ProgressUpdate1P3Container.builder().progressUpdate1P3(pu1p3).phase(phase).build();

        ProgressUpdate1P3Container actual = mapper.toProgressUpdate1P3Container(requestPayload, phase);

        assertEquals(expected, actual);
    }

}