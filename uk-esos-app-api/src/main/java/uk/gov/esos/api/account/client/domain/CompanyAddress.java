package uk.gov.esos.api.account.client.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompanyAddress {

    @JsonProperty("address_line_1")
    private String line1;

    @JsonProperty("address_line_2")
    private String line2;

    @JsonProperty("country")
    private String country;

    @JsonProperty("locality")
    private String city;

    @JsonProperty("postal_code")
    private String postcode;

    @JsonProperty("region")
    private String county;
}
