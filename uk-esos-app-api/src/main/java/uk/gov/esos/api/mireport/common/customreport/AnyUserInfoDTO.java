package uk.gov.esos.api.mireport.common.customreport;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnyUserInfoDTO {

    private String id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String phoneNumberCode;
    private String lastLoginDate;
    private String email;
    private String jobTitle;

    public String getFullName() {
        return Stream.of(firstName, lastName).filter(Objects::nonNull).collect(Collectors.joining(" "));
    }

    public String getTelephone() {
        return (phoneNumberCode != null ? String.format("+%s", phoneNumberCode) : "") +
                (phoneNumber != null ? phoneNumber : "");
    }
}
