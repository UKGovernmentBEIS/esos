package uk.gov.esos.api.verificationbody.domain.event;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Getter
@EqualsAndHashCode
@RequiredArgsConstructor
public class VerificationBodyStatusEnabledEvent {

    private final Set<Long> verificationBodyIds;
}
