package uk.gov.esos.api.reporting.noc.common.domain;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class NocViolation {

    private String sectionName;
    private String message;
    private Object[] data;

    public NocViolation(String sectionName, NocViolation.NocViolationMessage nocViolationMessage) {
        this(sectionName, nocViolationMessage, List.of());
    }

    public NocViolation(String sectionName, NocViolation.NocViolationMessage nocViolationMessage, Object... data) {
        this.sectionName = sectionName;
        this.message = nocViolationMessage.getMessage();
        this.data = data;
    }

    @Getter
    public enum NocViolationMessage {
        INVALID_SECTION("Invalid section"),
        INVALID_SECTION_DATA ("Invalid section data"),
        INVALID_DEPENDENT_SECTION_DATA("Invalid dependent section data"),

        INVALID_RESPONSIBILITY_ASSESSMENT_TYPE_LIST("Not all responsibility assessment types exist"),
        INVALID_RESPONSIBILITY_ASSESSMENT_TYPE("Responsibility assessment types and category are not mutually valid"),
        INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE_LIST("Not all no energy responsibility assessment types exist"),
        INVALID_NO_ENERGY_RESPONSIBILITY_ASSESSMENT_TYPE("No energy responsibility assessment types and category are not mutually valid"),
        INVALID_SECOND_RESPONSIBLE_OFFICER_DETAILS("Second responsible officer details and category are not mutually valid"),
        INVALID_REVIEW_ASSESSMENT_DATE("Second responsible officer details and category are not mutually valid"),
        INVALID_ENERGY_CONSUMPTION_DATA("Energy consumption data and category are not mutually valid"),
        INVALID_TOTAL_ENERGY_SAVINGS_ESTIMATION("Total energy savings estimation and category are not mutually valid"),
        INVALID_ENERGY_SAVINGS_CONSUMPTION("Energy savings consumption and category are not mutually valid"),
        INVALID_ENERGY_SAVINGS_CATEGORIES("Energy savings categories and category are not mutually valid"),
        INVALID_ENERGY_SAVINGS_CATEGORIES_COST("Energy savings categories reduction cost sum is not valid"),
        INVALID_ENERGY_CONSUMPTION_REDUCTION("Energy consumption reduction and category are not mutually valid"),
        INVALID_ENERGY_CONSUMPTION_REDUCTION_COST("Energy consumption reduction cost sum is not valid"),
        INVALID_ISO50001_DETAILS("Iso50001 details and compliance routes distribution are not mutually valid"),
        INVALID_DEC_DETAILS("DEC details and compliance routes distribution are not mutually valid"),
        INVALID_GDA_DETAILS("GDA details and compliance routes distribution are not mutually valid"),
        INVALID_REGISTRATION_NUMBER("Responsible undertaking organisation registration number is not valid"),
        INVALID_SIGNIFICANT_ENERGY_CONSUMPTION_EXISTS_ENERGY_NOT_AUDITED("Significant energy consumption cannot be false when energy not audited is bigger than 0"),
        ;

        private final String message;

        NocViolationMessage(String message) {
            this.message = message;
        }
    }
}
