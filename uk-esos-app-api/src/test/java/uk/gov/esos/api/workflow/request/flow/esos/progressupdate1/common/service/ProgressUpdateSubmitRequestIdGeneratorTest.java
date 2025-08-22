package uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.progressupdate1.phase3.common.domain.ProgressUpdate1P3RequestMetadata;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)

class ProgressUpdateSubmitRequestIdGeneratorTest {

    @InjectMocks
    private ProgressUpdateSubmitRequestIdGenerator generator;

    @Test
    void generate() {
        RequestParams params = RequestParams.builder()
                .accountId(7903L)
                .requestMetadata(ProgressUpdate1P3RequestMetadata.builder()
                        .type(RequestMetadataType.PROGRESS_UPDATE_1_P3)
                        .phase(Phase.PHASE_3)
                        .build())
                .build();

        String requestId = generator.generate(params);

        assertThat(requestId).isEqualTo("PU1007903-P3");
    }

    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(RequestType.PROGRESS_UPDATE_1_P3);
    }

    @Test
    void getPrefix() {
        assertThat(generator.getPrefix()).isEqualTo("PU1");
    }

}