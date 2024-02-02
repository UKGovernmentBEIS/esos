package uk.gov.esos.api.workflow.request.flow.common.service.notification;

import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.notification.template.domain.dto.templateparams.TemplateParams;
import uk.gov.esos.api.workflow.request.core.domain.Request;

public interface DocumentTemplateCommonParamsProvider {

	TemplateParams constructCommonTemplateParams(final Request request, final String signatory);
	
	AccountType getAccountType();
}
