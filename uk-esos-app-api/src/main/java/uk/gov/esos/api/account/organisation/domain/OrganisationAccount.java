package uk.gov.esos.api.account.organisation.domain;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SqlResultSetMapping;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountSearchResultsInfoDTO;
import uk.gov.esos.api.common.domain.CountyAddress;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@Entity
@Table(name = "account_organisation")
@SqlResultSetMapping(
        name = OrganisationAccount.ORGANISATION_ACCOUNT_SEARCH_RESULTS_INFO_DTO_RESULT_MAPPER,
        classes = {
                @ConstructorResult(
                        targetClass = OrganisationAccountSearchResultsInfoDTO.class,
                        columns = {
                                @ColumnResult(name = "id", type = Long.class),
                                @ColumnResult(name = "name"),
                                @ColumnResult(name = "organisation_id"),
                                @ColumnResult(name = "status", type = String.class)
                        }
                )})
public class OrganisationAccount extends Account {

    public static final String ORGANISATION_ACCOUNT_SEARCH_RESULTS_INFO_DTO_RESULT_MAPPER = "OrganisationAccountSearchResultsInfoDTOResultMapper";

    @Column(name = "registration_number")
    private String registrationNumber;

    @EqualsAndHashCode.Include
    @Column(name = "organisation_id", unique = true)
    @NotBlank
    @Size(min = 9, max = 9)
    private String organisationId;

    @Embedded
    @NotNull
    @Valid
    private CountyAddress address;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private OrganisationAccountStatus status;
    
    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Size(min = 1, max = 4)
    private List<ClassificationCode> classificationCodes;

    @Enumerated(EnumType.STRING)
    @Column(name = "location")
    @NotNull
    private CompetentAuthorityEnum location;
}
