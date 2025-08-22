package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestPayload;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

class ProgressUpdate1P3MapperTest {

    private final ProgressUpdate1P3Mapper mapper = Mappers.getMapper(ProgressUpdate1P3Mapper.class);

    @Test
    void testToProgressUpdate1P3ApplicationRequestActionPayload() {

        ProgressUpdate1P3 pu1p3 = ProgressUpdate1P3.builder()
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        ProgressUpdate1P3RequestPayload requestPayload = ProgressUpdate1P3RequestPayload.builder()
                .progressUpdate1P3(pu1p3)
                .isDisaggregateUndertaking(true)
                .build();

        RequestActionPayloadType payloadType = RequestActionPayloadType.PROGRESS_UPDATE_1_P3_APPLICATION_SUBMITTED_PAYLOAD;

        ProgressUpdate1P3ApplicationRequestActionPayload expected = ProgressUpdate1P3ApplicationRequestActionPayload.builder()
                .progressUpdate1P3(pu1p3)
                .payloadType(payloadType)
                .isDisaggregateUndertaking(true)
                .build();

        ProgressUpdate1P3ApplicationRequestActionPayload actual = mapper.toProgressUpdate1P3ApplicationRequestActionPayload(requestPayload, payloadType);

        assertEquals(expected, actual);
    }

}