package uk.gov.esos.api.reporting.progressupdate.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MeasureSchemeType {

    CLIMATE_CHANGE_AGREEMENTS_CCA("Climate Change Agreements (CCAs)"),
    STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR("Streamlined Energy and Carbon Reporting (SECR)"),
    UK_EMISSIONS_TRADING_SCHEME_ETS("UK Emissions Trading Scheme (ETS)"),
    UN_RACE_TO_ZERO("UN Race to Zero"),
    SCIENCE_BASED_TARGETS_INITIATIVE_SBTI("Science-Based Targets Initiative (SBTI)"),
    CARBON_REDUCTION_PLANS("Carbon Reduction Plans (required in the procurement of major Government contracts)"),
    OTHER("Other");

    private final String description;

}
