package uk.gov.esos.api.notification.template.domain.dto.templateparams;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class AccountTemplateParams {

    private String name;
    private CompetentAuthorityEnum competentAuthority;
    private AccountType accountType;
    private String location;
    
    private String primaryContact; //full name
    private String primaryContactEmail;
    
    private String serviceContact; //full name
    private String serviceContactEmail;
}
