package uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EstimatedCalculationType {

	TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION("the total energy consumption or, as applicable, significant energy consumption, over the reference period"),
	CONVERSION_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION("the conversion of total energy consumption or, as applicable, significant energy consumption into kWh, where it was not measured in those units"),
	AMOUNT_OF_TOTAL_OR_SIGNIFICANT_ENERGY_CONSUMPTION("the amount of total energy consumption or, as applicable, significant energy consumption attributable to each organisational purpose in kWh"),
	ENERGY_CONSUMPTION_OVER_TWELVE_MONTHS("the energy consumption over the 12-month period covered by any energy audit"),
	NONE_OF_THE_ABOVE("none of the above");

    private final String description;
}
