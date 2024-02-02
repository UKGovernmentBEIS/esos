package uk.gov.esos.api.mireport.common.customreport;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hibernate.query.NativeQuery;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;
import uk.gov.esos.api.mireport.organisation.OrganisationMiReportGeneratorHandler;
import uk.gov.esos.api.user.core.service.auth.UserAuthService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static uk.gov.esos.api.common.exception.ErrorCode.CUSTOM_REPORT_ERROR;

@Service
@RequiredArgsConstructor
@Log4j2
public abstract class CustomMiReportGeneratorHandler  {

    private final UserAuthService userAuthService;

    @SuppressWarnings("unchecked")
    public MiReportResult generateMiReport(EntityManager entityManager, CustomMiReportParams reportParams) {
        try {
            List<Map<String, Object>> results = entityManager.createNativeQuery(reportParams.getSqlQuery())
                    .unwrap(NativeQuery.class)
                    .setTupleTransformer((this::transformTuple))
                    .getResultList();

            ArrayList<String> columnNames = results.stream()
                    .findAny()
                    .map(result -> new ArrayList<>(result.keySet()))
                    .orElse(new ArrayList<>());

            // Inject user information
            if (columnNames.stream().anyMatch(CustomQueryUserAttributes.getAllPredicates().stream().reduce(x -> false, Predicate::or))) {

                Set<String> uniqueUserIds = new HashSet<>();
                results.forEach(row -> uniqueUserIds.addAll(collectUserIdsFromRow(row)));
                List<String> userIds = new ArrayList<>(uniqueUserIds);

                Map<String, Map<String, String>> usersInfo = getUserInfoByUserIds(userIds);

                results.forEach(row -> updateUserInfoInRow(row, usersInfo));

                Arrays.stream(CustomQueryUserAttributes.values()).forEach(attribute ->
                        columnNames.replaceAll(columnName -> columnName.replace(attribute.getKeyword(), "")));
            }

            return CustomMiReportResult.builder()
                    .reportType(getReportType())
                    .columnNames(columnNames)
                    .results(results).build();
        } catch (Exception ex) {
            log.error(ex);
            throw new BusinessException(CUSTOM_REPORT_ERROR);
        }
    }

    public MiReportType getReportType() {
        return MiReportType.CUSTOM;
    }

    private Object transformTuple(Object[] tuple, String[] aliases) {
        Map<String, Object> row = new LinkedHashMap<>();
        for (int i = 0; i < aliases.length; i++) {
            row.put(aliases[i], tuple[i]);
        }
        return row;
    }

    private List<String> collectUserIdsFromRow(Map<String, Object> row) {
        List<String> ids = new ArrayList<>();
        Arrays.stream(CustomQueryUserAttributes.values())
                .forEach(attribute -> ids.addAll(
                        row.entrySet().stream()
                                .filter(column -> (attribute.getPredicate().test(column.getKey())))
                                .map(column -> (String)column.getValue())
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList())
                ));

        return ids;
    }

    private Map<String, Map<String, String>> getUserInfoByUserIds(List<String> userIds) {
        final ObjectMapper objectMapper = new ObjectMapper();

        return userAuthService.getUsersWithAttributes(userIds, AnyUserInfoDTO.class)
                .stream()
                .map(e -> objectMapper.convertValue(e, new TypeReference<Map<String, String>>() {}))
                .collect(Collectors.toMap(e -> e.get("id"), e -> e));
    }

    private void updateUserInfoInRow(Map<String, Object> row, Map<String, Map<String, String>> usersInfo) {
        Map<String, Object> updatedValues = new HashMap<>();

        Arrays.stream(CustomQueryUserAttributes.values()).forEach(attribute -> {
            row.entrySet().stream()
                    .filter(column -> (attribute.getPredicate().test(column.getKey())))
                    .forEach(column -> {
                        Map<String, String> userInfo = usersInfo.get(column.getValue());
                        updatedValues.put(column.getKey().replace(attribute.getKeyword(), ""), userInfo != null ? userInfo.get(attribute.getAttribute()) : column.getValue());
                    });
            row.entrySet().removeIf(column -> (attribute.getPredicate().test(column.getKey())));
        });

        row.putAll(updatedValues);
    }

}
