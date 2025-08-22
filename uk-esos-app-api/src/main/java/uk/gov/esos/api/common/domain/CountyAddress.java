package uk.gov.esos.api.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class CountyAddress {

    @Column(name = "address_line1", nullable = false)
    @NotBlank
    private String line1;

    @Column(name = "address_line2")
    private String line2;

    @Column(name = "city", nullable = false)
    @NotBlank
    private String city;

    @Column(name = "county")
    private String county;

    @Column(name = "postcode", nullable = false)
    @NotBlank
    private String postcode;
}
