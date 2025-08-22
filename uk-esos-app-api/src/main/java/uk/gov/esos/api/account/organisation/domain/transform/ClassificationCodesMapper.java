package uk.gov.esos.api.account.organisation.domain.transform;

import java.util.List;

import lombok.experimental.UtilityClass;
import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.common.domain.ClassificationCodes;

@UtilityClass
public class ClassificationCodesMapper {

	public List<ClassificationCode> toClassificationCodeList(ClassificationCodes codes, OrganisationAccount account) {
		return codes.getCodes()
    			.stream()
    			.map(code -> ClassificationCode.builder()
    					.account(account)
    					.type(codes.getType())
    					.name(codes.getOtherTypeName())
    					.code(code)
    					.build())
    			.toList();
	}
}
