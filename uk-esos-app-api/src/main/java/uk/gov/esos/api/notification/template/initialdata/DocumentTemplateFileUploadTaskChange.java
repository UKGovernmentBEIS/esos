package uk.gov.esos.api.notification.template.initialdata;

import liquibase.change.custom.CustomTaskChange;
import liquibase.database.Database;
import liquibase.exception.CustomChangeException;
import liquibase.exception.SetupException;
import liquibase.exception.ValidationErrors;
import liquibase.resource.ResourceAccessor;
import lombok.Getter;
import lombok.Setter;
import uk.gov.esos.api.common.domain.dto.ResourceFile;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.utils.ResourceFileUtil;

import java.io.File;
import java.io.IOException;

@Getter
@Setter
public abstract class DocumentTemplateFileUploadTaskChange implements CustomTaskChange {

	private CompetentAuthorityEnum competentAuthority;
    private String fileDocumentName;

    private AccountType accountType;

    @Override
    public String getConfirmationMessage() {
        return "File document upload successfully completed";
    }

    @Override
    public void setUp() throws SetupException {
    }

    @Override
    public void setFileOpener(ResourceAccessor resourceAccessor) {
    }

    @Override
    public ValidationErrors validate(Database database) {
        return null;
    }

    protected ResourceFile findCaTemplateResourceFile()
        throws CustomChangeException {
        String resourcePath = "templates" + File.separator + "ca" + File.separator + competentAuthority.name().toLowerCase() + File.separator + accountType.name().toLowerCase() + File.separator + fileDocumentName;
        try {
            return ResourceFileUtil.getResourceFile(resourcePath);
        } catch (IOException e) {
            throw new CustomChangeException(e.getMessage());
        }
    }
}
