package uk.gov.esos.api.reporting.progressupdate.common.domain;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class ProgressUpdateViolation {

    private String sectionName;
    private String message;
    private Object[] data;

    public ProgressUpdateViolation(String sectionName, ProgressUpdateViolation.ProgressUpdateViolationMessage pu1ViolationMessage ) {
        this(sectionName, pu1ViolationMessage , List.of());
    }

    public ProgressUpdateViolation(String sectionName, ProgressUpdateViolation.ProgressUpdateViolationMessage pu1ViolationMessage , Object... data) {
        this.sectionName = sectionName;
        this.message = pu1ViolationMessage .getMessage();
        this.data = data;
    }

    @Getter
    public enum ProgressUpdateViolationMessage {
        INVALID_SECTION("Invalid section"),
        INVALID_SECTION_DATA ("Invalid section data"),
        INVALID_GROUP_CHANGE("Invalid Progress Update group change data"),
        INVALID_PROGRESS_UPDATE_NAME_OR_CRN("Invalid Progress Update, CRN can not be the same of the current account crn, same with the name");

        private final String message;

        ProgressUpdateViolationMessage(String message) {
            this.message = message;
        }
    }

}
