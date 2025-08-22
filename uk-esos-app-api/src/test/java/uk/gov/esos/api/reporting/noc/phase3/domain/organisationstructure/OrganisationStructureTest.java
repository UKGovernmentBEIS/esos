package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class OrganisationStructureTest {

    private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_only_numbers_registration_number_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                        ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_no_registration_number_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.FALSE)
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_organisation_details_not_exist_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.isNonComplyingUndertakingsIncluded}");
    }

    @Test
    void validate_no_registration_number_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumberExist}");
    }

    @Test
    void validate_registration_number_exist_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.FALSE)
                        .registrationNumber("12345678")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumberExist}");
    }

    @Test
    void validate_invalid_registration_number_format_less_digits() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("12345")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_one_character_registration_number_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("A1234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_two_characters_registration_number_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("AB123456")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_invalid_registration_number_format_more_characters() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("ABC12345")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_invalid_registration_number_format_more_digits() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("A123456789")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_invalid_registration_number_format_less_digits_and_characters() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("A1234")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_invalid_registration_number_format_lowercase_letters() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("ab123456")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_classification_codes_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(ClassificationCodesDetails.builder()
                                .areSameAsRU(Boolean.FALSE)
                                .codes(ClassificationCodes.builder()
                                        .type(ClassificationType.SIC)
                                        .codes(List.of("code 1"))
                                        .build())
                                .build())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_is_covered_by_notification_false_sic_codes_exist_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(ClassificationCodesDetails.builder()
                                .areSameAsRU(Boolean.FALSE)
                                .codes(ClassificationCodes.builder()
                                        .type(ClassificationType.SIC)
                                        .codes(List.of("code 1"))
                                        .build())
                                .build())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_are_same_as_ru_true_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(ClassificationCodesDetails.builder()
                                .areSameAsRU(Boolean.TRUE)
                                .build())
                        .build()))
                .isGroupStructureChartProvided(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_are_same_as_ru_true_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(ClassificationCodesDetails.builder()
                                .areSameAsRU(Boolean.TRUE)
                                .codes(ClassificationCodes.builder()
                                        .type(ClassificationType.SIC)
                                        .codes(List.of("code 1"))
                                        .build())
                                .build())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.codes}");
    }

    @Test
    void validate_are_same_as_ru_false_no_sic_codes_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.TRUE)
                .isNonComplyingUndertakingsIncluded(Boolean.FALSE)
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(ClassificationCodesDetails.builder()
                                .areSameAsRU(Boolean.FALSE)
                                .build())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.codes}");
    }

    @Test
    void validate_organisation_parent_and_subsidiary_not_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("01234567")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.isParentOfResponsibleUndertaking}");
    }

    @Test
    void validate_two_letters_last_letter_registration_number_valid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("AB23456R")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_two_letters_last_more_digits_registration_number_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("AB23456R1")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_digits_last_letter_registration_number_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("0123456R")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_one_letter_last_letter_registration_number_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("A123456R")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_lower_case_letters_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("ab123456R")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_last_lower_case_letters_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("AB123456r")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    @Test
    void validate_two_letters_letter_not_in_the_end_invalid() {
        OrganisationStructure organisationStructure = OrganisationStructure.builder()
                .isHighestParent(Boolean.FALSE)
                .isNonComplyingUndertakingsIncluded(Boolean.TRUE)
                .organisationUndertakingDetails(Set.of(
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 1").registrationNumber("registration number 1").build(),
                        OrganisationUndertakingDetails.builder().organisationName("organisation name 2").registrationNumber("registration number 2").build()
                ))
                .organisationsAssociatedWithRU(Set.of(OrganisationAssociatedWithRU.builder()
                        .registrationNumberExist(Boolean.TRUE)
                        .registrationNumber("AB123R56")
                        .organisationName("name")
                        .isParentOfResponsibleUndertaking(Boolean.TRUE)
                        .isPartOfArrangement(Boolean.FALSE)
                        .isSubsidiaryOfResponsibleUndertaking(Boolean.FALSE)
                        .isPartOfFranchise(Boolean.TRUE)
                        .hasCeasedToBePartOfGroup(Boolean.FALSE)
                        .classificationCodesDetails(buildClassificationCodes())
                        .build()))
                .isGroupStructureChartProvided(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<OrganisationStructure>> violations = validator.validate(organisationStructure);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
                .containsExactly("{noc.organisationStructure.registrationNumber}");
    }

    private ClassificationCodesDetails buildClassificationCodes() {
        return ClassificationCodesDetails.builder()
                .areSameAsRU(Boolean.TRUE)
                .build();
    }
}
