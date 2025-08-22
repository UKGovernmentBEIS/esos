package uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Container;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME , include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "phase", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = ProgressUpdate2P3Container.class, name = "PHASE_3"),
})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdate2Container {

    @NotNull
    private Phase phase;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Map<UUID, String> progressUpdate1Attachments = new HashMap<>();
}
