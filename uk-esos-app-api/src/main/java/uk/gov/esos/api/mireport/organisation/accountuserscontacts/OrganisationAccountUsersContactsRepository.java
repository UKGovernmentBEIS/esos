package uk.gov.esos.api.mireport.organisation.accountuserscontacts;

import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.mireport.common.accountuserscontacts.AccountUserContact;
import uk.gov.esos.api.mireport.common.accountuserscontacts.AccountUsersContactsRepository;

import jakarta.persistence.EntityManager;
import java.util.List;

@Repository
public class OrganisationAccountUsersContactsRepository implements AccountUsersContactsRepository {

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<AccountUserContact> findAccountUserContacts(EntityManager entityManager) {
        return entityManager.createNativeQuery(
                        "select auth.user_id as \"userId\", role.name as \"role\",  acc_org.organisation_id as \"accountId\", account.name as \"accountName\", " +
                                "acc_org.registration_number as \"registrationNumber\", acc_org.status as \"accountStatus\", auth.status as \"authorityStatus\", acc_org.location as \"accountLocation\",\n" +
                                "       case when acPrimary.user_id is not null then true else false end as \"primaryContact\",\n" +
                                "       case when acSecondary.user_id is not null then true else false end as \"secondaryContact\"\n" +
                                "from account\n" +
                                "    inner join account_organisation acc_org on account.id = acc_org.id " +
                                "    left join au_authority auth on account.id = auth.account_id\n" +
                                "    left join au_role role on auth.code = role.code\n" +
                                "    left join account_contact acPrimary on account.id = acPrimary.account_id and auth.user_id=acPrimary.user_id and acPrimary.contact_type='PRIMARY'\n" +
                                "    left join account_contact acSecondary on account.id = acSecondary.account_id and auth.user_id=acSecondary.user_id and acSecondary.contact_type='SECONDARY'\n")
                .unwrap(NativeQuery.class)
                .addScalar("userId", StandardBasicTypes.STRING)
                .addScalar("accountId", StandardBasicTypes.STRING)
                .addScalar("accountName", StandardBasicTypes.STRING)
                .addScalar("registrationNumber", StandardBasicTypes.STRING)
                .addScalar("accountStatus", StandardBasicTypes.STRING)
                .addScalar("authorityStatus", StandardBasicTypes.STRING)
                .addScalar("primaryContact", StandardBasicTypes.BOOLEAN)
                .addScalar("secondaryContact", StandardBasicTypes.BOOLEAN)
                .addScalar("role", StandardBasicTypes.STRING)
                .addScalar("accountLocation", StandardBasicTypes.STRING)
                .setReadOnly(true)
                .setTupleTransformer(Transformers.aliasToBean(AccountUserContact.class)) //https://vladmihalcea.com/hibernate-resulttransformer/
                .getResultList();
    }
}
