package uk.gov.esos.api.account.client.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompanyProfile {

    @JsonProperty("company_name")
    private String name;

    @JsonProperty("company_number")
    private String registrationNumber;

    @JsonProperty("company_status")
    private String status;

    @JsonProperty("jurisdiction")
    private String jurisdiction;

    @JsonProperty("registered_office_address")
    private CompanyAddress address;

    @JsonProperty("sic_codes")
    private List<String> sicCodes;
}
