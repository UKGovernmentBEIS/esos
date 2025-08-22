package uk.gov.esos.api.workflow.request.flow.esos.noc.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.domain.NotificationOfComplianceP3RequestMetadata;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class NotificationOfComplianceSubmitRequestIdGeneratorTest {

    @InjectMocks
    private NotificationOfComplianceSubmitRequestIdGenerator generator;

    @Test
    void generate() {
        RequestParams params = RequestParams.builder()
                .accountId(7903L)
                .requestMetadata(NotificationOfComplianceP3RequestMetadata.builder()
                        .type(RequestMetadataType.NOTIFICATION_OF_COMPLIANCE_P3)
                        .phase(Phase.PHASE_3)
                        .build())
                .build();

        String requestId = generator.generate(params);

        assertThat(requestId).isEqualTo("NOC007903-P3");
    }


    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(RequestType.NOTIFICATION_OF_COMPLIANCE_P3);
    }

    @Test
    void getPrefix() {
        assertThat(generator.getPrefix()).isEqualTo("NOC");
    }
}
