package uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3ApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate2.phase3.common.domain.ProgressUpdate2P3RequestPayload;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateP3Confirmation.ESOS_ACTION_PLAN_COMPLIANCE;

class ProgressUpdate2P3MapperTest {

    private final ProgressUpdate2P3Mapper mapper = Mappers.getMapper(ProgressUpdate2P3Mapper.class);

    @Test
    void testToProgressUpdate2P3ApplicationRequestActionPayload() {

        ProgressUpdate2P3 pu2p3 = ProgressUpdate2P3.builder()
                .responsibleOfficerConfirmation(Set.of(ESOS_ACTION_PLAN_COMPLIANCE))
                .build();

        ProgressUpdate2P3RequestPayload requestPayload = ProgressUpdate2P3RequestPayload.builder()
                .progressUpdate2P3(pu2p3)
                .build();

        RequestActionPayloadType payloadType = RequestActionPayloadType.PROGRESS_UPDATE_2_P3_APPLICATION_SUBMITTED_PAYLOAD;

        ProgressUpdate2P3ApplicationRequestActionPayload expected = ProgressUpdate2P3ApplicationRequestActionPayload.builder()
                .progressUpdate2P3(pu2p3)
                .payloadType(payloadType)
                .build();

        ProgressUpdate2P3ApplicationRequestActionPayload actual = mapper.toProgressUpdate2P3ApplicationRequestActionPayload(requestPayload, payloadType);

        assertEquals(expected, actual);
    }

}