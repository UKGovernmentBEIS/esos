package uk.gov.esos.api.workflow.request.flow.esos.actionplan.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestMetadataType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.esos.actionplan.phase3.common.domain.ActionPlanP3RequestMetadata;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class ActionPlanSubmitRequestIdGeneratorTest {

    @InjectMocks
    private ActionPlanSubmitRequestIdGenerator generator;

    @Test
    void generate() {
        RequestParams params = RequestParams.builder()
                .accountId(7903L)
                .requestMetadata(ActionPlanP3RequestMetadata.builder()
                        .type(RequestMetadataType.ACTION_PLAN_P3)
                        .phase(Phase.PHASE_3)
                        .build())
                .build();

        String requestId = generator.generate(params);

        assertThat(requestId).isEqualTo("AP007903-P3");
    }


    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(RequestType.ACTION_PLAN_P3);
    }

    @Test
    void getPrefix() {
        assertThat(generator.getPrefix()).isEqualTo("AP");
    }
}
