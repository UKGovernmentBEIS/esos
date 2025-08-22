package uk.gov.esos.api.reporting.actionplan.common.domain;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class ActionPlanViolation {
    private String sectionName;
    private String message;
    private Object[] data;

    public ActionPlanViolation(String sectionName, ActionPlanViolation.ActionPlanViolationMessage actionPlanViolationMessage ) {
        this(sectionName, actionPlanViolationMessage , List.of());
    }

    public ActionPlanViolation(String sectionName, ActionPlanViolation.ActionPlanViolationMessage actionPlanViolationMessage , Object... data) {
        this.sectionName = sectionName;
        this.message = actionPlanViolationMessage .getMessage();
        this.data = data;
    }

    @Getter
    public enum ActionPlanViolationMessage {
        INVALID_SECTION("Invalid section"),
        INVALID_SECTION_DATA ("Invalid section data");

        private final String message;

        ActionPlanViolationMessage(String message) {
            this.message = message;
        }
    }

}
