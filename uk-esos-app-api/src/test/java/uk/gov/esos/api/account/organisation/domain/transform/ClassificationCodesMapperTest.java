package uk.gov.esos.api.account.organisation.domain.transform;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;

class ClassificationCodesMapperTest {

	@Test
	void toClassificationCodeList() {
		ClassificationCodes codes = ClassificationCodes.builder()
				.type(ClassificationType.SIC)
				.codes(List.of("code1", "code2"))
				.build();
		List<ClassificationCode> expectedCodes = List.of(ClassificationCode.builder()
				.type(ClassificationType.SIC)
				.code("code1")
				.build(),
				ClassificationCode.builder()
				.type(ClassificationType.SIC)
				.code("code2")
				.build());
		assertEquals(expectedCodes, ClassificationCodesMapper.toClassificationCodeList(codes, null));
	}
}
