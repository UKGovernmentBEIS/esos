package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;

import uk.gov.esos.api.reporting.noc.phase3.domain.EnergyConsumptionPotentialReduction;
import uk.gov.esos.api.reporting.noc.phase3.domain.EnergySavingsCategoriesPotentialReduction;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PotentialReductionEnergyCostValidator {

    public boolean isEnergyConsumptionValid(EnergyConsumptionPotentialReduction potentialReduction) {
        if(ObjectUtils.isEmpty(potentialReduction)) {
            return true;
        }

        BigDecimal total = BigDecimal.ZERO;

        BigDecimal buildings =
                potentialReduction.getBuildings() != null 
                        ? potentialReduction.getBuildings().getEnergyCost()
                        : null;
        BigDecimal transport =
                potentialReduction.getTransport() != null
                        ? potentialReduction.getTransport().getEnergyCost()
                        : null;
        BigDecimal industrialProcesses =
                potentialReduction.getIndustrialProcesses() != null
                        ? potentialReduction.getIndustrialProcesses().getEnergyCost()
                        : null;
        BigDecimal otherProcesses =
                potentialReduction.getOtherProcesses() != null
                        ? potentialReduction.getOtherProcesses().getEnergyCost()
                        : null;

        if (buildings == null && transport == null && industrialProcesses == null && otherProcesses == null) {
        	return potentialReduction.getEnergyCostTotal() == null;
        }
        // Find total cost
        total = total.add(zeroIfNull(buildings)).add(zeroIfNull(transport)).add(zeroIfNull(industrialProcesses))
        		.add(zeroIfNull(otherProcesses)).setScale(2, RoundingMode.HALF_DOWN);

        return total.equals(potentialReduction.getEnergyCostTotal());
    }

	public boolean isEnergySavingsCategoriesValid(EnergySavingsCategoriesPotentialReduction potentialReduction) {
        if(ObjectUtils.isEmpty(potentialReduction)) {
            return true;
        }

        BigDecimal total = BigDecimal.ZERO;

        BigDecimal energyManagementPractices =
                potentialReduction.getEnergyManagementPractices() != null
                        ? potentialReduction.getEnergyManagementPractices().getEnergyCost()
                        : null;
        BigDecimal behaviourChangeInterventions =
                potentialReduction.getBehaviourChangeInterventions() != null
                        ? potentialReduction.getBehaviourChangeInterventions().getEnergyCost()
                        : null;
        BigDecimal training =
                potentialReduction.getTraining() != null
                        ? potentialReduction.getTraining().getEnergyCost()
                        : null;
        BigDecimal controlsImprovements =
                potentialReduction.getControlsImprovements() != null
                        ? potentialReduction.getControlsImprovements().getEnergyCost()
                        : null;
        BigDecimal capitalInvestments =
                potentialReduction.getCapitalInvestments() != null
                        ? potentialReduction.getCapitalInvestments().getEnergyCost()
                        : null;
        BigDecimal otherMeasures =
                potentialReduction.getOtherMeasures() != null
                        ? potentialReduction.getOtherMeasures().getEnergyCost()
                        : null;

        if (energyManagementPractices == null && behaviourChangeInterventions == null && training == null && controlsImprovements == null
        		&& capitalInvestments == null && otherMeasures == null) {
        	return potentialReduction.getEnergyCostTotal() == null;
        }
        
        // Find total cost
        total = total.add(zeroIfNull(energyManagementPractices)).add(zeroIfNull(behaviourChangeInterventions)).add(zeroIfNull(training))
        		.add(zeroIfNull(controlsImprovements)).add(zeroIfNull(capitalInvestments))
        		.add(zeroIfNull(otherMeasures)).setScale(2, RoundingMode.HALF_DOWN);

        return total.equals(potentialReduction.getEnergyCostTotal());
    }
	
	private BigDecimal zeroIfNull(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}
}
