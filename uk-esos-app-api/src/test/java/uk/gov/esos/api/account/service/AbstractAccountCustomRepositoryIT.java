package uk.gov.esos.api.account.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.transaction.AfterTransaction;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.repository.AccountCustomRepositoryImpl;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.account.transform.AccountMapper;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.request.WorkflowService;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest(
    properties = {
        "camunda.bpm.enabled=false"
    }
)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public abstract class AbstractAccountCustomRepositoryIT extends AbstractContainerBaseTest {

    public static final long TEST_ACCOUNT_ID = 1L;
    public static final String TEST_ACCOUNT_NAME = "accountName";

    public abstract Account buildAccount(Long id, String accountName, CompetentAuthorityEnum ca, CompetentAuthorityEnum location);

    @Autowired
    private AccountRepository repository;

    @Autowired
    private AccountCustomRepositoryImpl accountCustomRepository;

    @Autowired
    private TransactionTemplate txTemplate;

    @MockBean
    AccountMapper accountMapper;

    @MockBean
    WorkflowService workflowService;

    @BeforeEach
    @BeforeTransaction // without this annotation, the test does not see the db entry
    public void setUp() {
        String initialAccountName = "initialAccountName";
        Account account = buildAccount(TEST_ACCOUNT_ID, initialAccountName, CompetentAuthorityEnum.WALES, CompetentAuthorityEnum.WALES);
        repository.save(account);
    }

    @AfterEach
    @AfterTransaction // without this annotation, the entry is not actually deleted
    public void tearDown() {
        repository.deleteById(TEST_ACCOUNT_ID);
    }

    @Test
    @DisplayName("should use write lock and read correct account status from second thread when status updated in first thread")
    void shouldUseWriteLock() {
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        // both threads wait for this latch. this way they start at the same time
        CountDownLatch startLatch = new CountDownLatch(1);
        // first thread locks the db row then releases this latch, to ensure that second thread always asks for the lock second
        CountDownLatch startSecondThreadLatch = new CountDownLatch(1);
        // main thread waits for this latch, so it can assert after both threads have run.
        CountDownLatch stopLatch = new CountDownLatch(2);
        // we can assert only form main thread, so we need to access the result of the query of 2nd thread in the main thread
        AtomicReference<Account> accountFromSecondThread = new AtomicReference<>();

        Runnable r1 = () -> {
            try {
                txTemplate.execute(new TransactionCallbackWithoutResult() {
                    @Override
                    protected void doInTransactionWithoutResult(TransactionStatus status) {
                        await(startLatch);
                        Account account = accountCustomRepository.findByIdForUpdate(TEST_ACCOUNT_ID).get();
                        startSecondThreadLatch.countDown();
                        account.setName(TEST_ACCOUNT_NAME);
                        repository.save(account);
                    }
                });
            } finally {
                stopLatch.countDown();
            }
        };

        Runnable r2 = () -> {
            try {
                Account account = txTemplate.execute(status -> {
                    await(startSecondThreadLatch);
                    return accountCustomRepository.findByIdForUpdate(TEST_ACCOUNT_ID).get();
                });
                accountFromSecondThread.set(account);
            } finally {
                stopLatch.countDown();
            }
        };

        executorService.execute(r1);
        executorService.execute(r2);
        // first thread executes
        startLatch.countDown();
        // both threads have finished
        await(stopLatch);
        // clean up
        executorService.shutdown();
        // NOTE: to see this tess fail, comment out the @Lock annotation in AccountRepository's method
        assertThat(accountFromSecondThread.get().getName()).isEqualTo(TEST_ACCOUNT_NAME);
    }

    private void await(CountDownLatch latch) {
        try {
            latch.await();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
