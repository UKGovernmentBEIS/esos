package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.domain.ProgressUpdate1Entity;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.repository.ProgressUpdate1Repository;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;

@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3QueryService {

    private final ProgressUpdate1Repository progressUpdate1Repository;

    public ProgressUpdate1P3 getProgressUpdate1ByAccountId(Long accountId){
        ProgressUpdate1Entity entity = progressUpdate1Repository.findByAccountId(accountId)
                .orElseThrow(() -> new NotFoundException("PU1 not found for account ID: " + accountId));
        return ((ProgressUpdate1P3Container) entity.getProgressUpdate1Container()).getProgressUpdate1P3();
    }
}
