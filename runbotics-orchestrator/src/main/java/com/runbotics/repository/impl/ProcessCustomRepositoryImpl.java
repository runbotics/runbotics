package com.runbotics.repository.impl;

import com.runbotics.domain.Guest;
import com.runbotics.domain.Guest_;
import com.runbotics.domain.Process;
import com.runbotics.domain.Process_;
import com.runbotics.domain.Tag_;
import com.runbotics.domain.User;
import com.runbotics.domain.User_;
import com.runbotics.repository.ProcessCustomRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.utils.ProcessQueryBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.ParameterExpression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class ProcessCustomRepositoryImpl implements ProcessCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private final String PROCESS_NAME = "name";
    private final String PROCESS_TAG_NAME = "tagName";
    private final String PROCESS_CREATED_BY_NAME = "createdByName";
    private final String PROCESS_USER = "user";
    private final String PROCESS_COLLECTION = "process_collection";

    public Page<Process> findBySearch(String name, String createdByName, String tagName, User user, Pageable pageable) {
        boolean hasUserRoleAdmin = user.getAuthorities().stream().anyMatch(auth -> auth.getName().equals(AuthoritiesConstants.ADMIN));
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        ProcessQueryBuilder processQueryBuilder = buildProcessQuery();
        CriteriaQuery<Process> criteriaQuery = processQueryBuilder.getCriteriaQuery();
        CriteriaQuery<Long> criteriaCountingQuery = processQueryBuilder.getCriteriaCountingQuery();
        List<Predicate> predicates = processQueryBuilder.getPredicateList();

        if (!hasUserRoleAdmin) {
            Root<Process> root = processQueryBuilder.getRoot();
            Join<Object, Object> userJoin = processQueryBuilder.getUser();

            Subquery<Guest> subquery = criteriaQuery.subquery(Guest.class);
            Root<Guest> guestRoot = subquery.from(Guest.class);
            subquery.select(guestRoot.get(Guest_.USER));

            ParameterExpression<User> pUser = criteriaBuilder.parameter(User.class, PROCESS_USER);

            predicates.add(
                criteriaBuilder.or(
                    criteriaBuilder.equal(root.get(Process_.CREATED_BY), pUser),
                    criteriaBuilder.equal(root.get(Process_.IS_PUBLIC), true)
                )
            );
            predicates.add(criteriaBuilder.in(userJoin).value(subquery).not());
        }

        criteriaQuery.where(predicates.toArray(new Predicate[] {}));
        criteriaCountingQuery.where(predicates.toArray(new Predicate[] {}));

        TypedQuery<Process> query = entityManager
            .createQuery(criteriaQuery)
            .setParameter(PROCESS_NAME, "%" + name.toUpperCase() + "%")
            .setParameter(PROCESS_CREATED_BY_NAME, "%" + createdByName.toUpperCase() + "%")
            .setParameter(PROCESS_TAG_NAME, "%" + tagName.toUpperCase() + "%");
        if (!hasUserRoleAdmin) query.setParameter(PROCESS_USER, user);

        TypedQuery<Long> cQuery = entityManager
            .createQuery(criteriaCountingQuery)
            .setParameter(PROCESS_NAME, "%" + name.toUpperCase() + "%")
            .setParameter(PROCESS_CREATED_BY_NAME, "%" + createdByName.toUpperCase() + "%")
            .setParameter(PROCESS_TAG_NAME, "%" + tagName.toUpperCase() + "%");
        if (!hasUserRoleAdmin) cQuery.setParameter(PROCESS_USER, user);

        return getPageResult(pageable, query, cQuery);
    }

    public Page<Process> findBySearchAndCollection(
        String name,
        String createdByName,
        String tagName,
        UUID collectionId,
        User user,
        Pageable pageable
    ) {
        boolean hasUserRoleAdmin = user.getAuthorities().stream().anyMatch(auth -> auth.getName().equals(AuthoritiesConstants.ADMIN));
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        ProcessQueryBuilder processQueryBuilder = buildProcessQuery();
        CriteriaQuery<Process> criteriaQuery = processQueryBuilder.getCriteriaQuery();
        CriteriaQuery<Long> criteriaCountingQuery = processQueryBuilder.getCriteriaCountingQuery();
        List<Predicate> predicates = processQueryBuilder.getPredicateList();
        Root<Process> root = processQueryBuilder.getRoot();

        if (!hasUserRoleAdmin) {
            Join<Object, Object> userJoin = processQueryBuilder.getUser();

            Subquery<Guest> subquery = criteriaQuery.subquery(Guest.class);
            Root<Guest> guestRoot = subquery.from(Guest.class);
            subquery.select(guestRoot.get(Guest_.USER));

            ParameterExpression<User> pUser = criteriaBuilder.parameter(User.class, PROCESS_USER);

            predicates.add(
                criteriaBuilder.or(
                    criteriaBuilder.equal(root.get(Process_.CREATED_BY), pUser),
                    criteriaBuilder.equal(root.get(Process_.IS_PUBLIC), true)
                )
            );
            predicates.add(criteriaBuilder.in(userJoin).value(subquery).not());
        }

        ParameterExpression<UUID> pCollectionId = criteriaBuilder.parameter(UUID.class, PROCESS_COLLECTION);

        criteriaQuery.where(predicates.toArray(new Predicate[] {}));
        criteriaCountingQuery.where(predicates.toArray(new Predicate[] {}));

        TypedQuery<Process> query = entityManager
            .createQuery(criteriaQuery)
            .setParameter(PROCESS_NAME, "%" + name.toUpperCase() + "%")
            .setParameter(PROCESS_CREATED_BY_NAME, "%" + createdByName.toUpperCase() + "%")
            .setParameter(PROCESS_TAG_NAME, "%" + tagName.toUpperCase() + "%");
        if (!hasUserRoleAdmin) query.setParameter(PROCESS_USER, user);
        if (collectionId != null) query.setParameter(PROCESS_COLLECTION, collectionId);

        TypedQuery<Long> cQuery = entityManager
            .createQuery(criteriaCountingQuery)
            .setParameter(PROCESS_NAME, "%" + name.toUpperCase() + "%")
            .setParameter(PROCESS_CREATED_BY_NAME, "%" + createdByName.toUpperCase() + "%")
            .setParameter(PROCESS_TAG_NAME, "%" + tagName.toUpperCase() + "%");
        if (!hasUserRoleAdmin) cQuery.setParameter(PROCESS_USER, user);
        if (collectionId != null) cQuery.setParameter(PROCESS_COLLECTION, collectionId);

        return getPageResult(pageable, query, cQuery);
    }

    private ProcessQueryBuilder buildProcessQuery() {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        CriteriaQuery<Process> cq = criteriaBuilder.createQuery(Process.class);
        Root<Process> root = cq.from(Process.class);
        Join<Object, Object> user = root.join(Process_.CREATED_BY, JoinType.LEFT);
        Join<Object, Object> tag = root.join(Process_.TAGS, JoinType.LEFT);
        cq.select(root);
        cq.groupBy(root.get(Process_.ID));
        cq.orderBy(criteriaBuilder.desc(root.get(Process_.UPDATED)));

        CriteriaQuery<Long> cqCount = criteriaBuilder.createQuery(Long.class);
        Root<Process> cRoot = cqCount.from(Process.class);
        Join<Object, Object> cUser = cRoot.join(Process_.CREATED_BY, JoinType.LEFT);
        Join<Object, Object> cTag = cRoot.join(Process_.TAGS, JoinType.LEFT);
        cqCount.select(criteriaBuilder.countDistinct(cRoot));

        ParameterExpression<String> pName = criteriaBuilder.parameter(String.class, PROCESS_NAME);
        ParameterExpression<String> pTagName = criteriaBuilder.parameter(String.class, PROCESS_TAG_NAME);
        ParameterExpression<String> pCreatedByName = criteriaBuilder.parameter(String.class, PROCESS_CREATED_BY_NAME);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(
            criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.upper(root.get(Process_.NAME)), pName),
                criteriaBuilder.like(criteriaBuilder.upper(user.get(User_.EMAIL)), pCreatedByName),
                criteriaBuilder.like(criteriaBuilder.upper(tag.get(Tag_.NAME)), pTagName)
            )
        );

        return new ProcessQueryBuilder(root, user, cq, cqCount, predicates);
    }

    private Page<Process> getPageResult(Pageable pageable, TypedQuery<Process> query, TypedQuery<Long> countingQuery) {
        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();

        List<Process> queryResult = query.setFirstResult(pageNumber * pageSize).setMaxResults(pageSize).getResultList();

        Long totalPages = countingQuery.getSingleResult();

        return new PageImpl<>(queryResult, pageable, totalPages);
    }
}
