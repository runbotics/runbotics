package com.runbotics.utils;

import com.runbotics.domain.Process;

import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;

public class ProcessQueryBuilder {

    private final Root<Process> root;

    private final Join<Object, Object> user;

    private final CriteriaQuery<Process> criteriaQuery;

    private final CriteriaQuery<Long> criteriaCountingQuery;

    private final List<Predicate> predicateList;

    public ProcessQueryBuilder(
        Root<Process> root,
        Join<Object, Object> user,
        CriteriaQuery<Process> criteriaQuery,
        CriteriaQuery<Long> criteriaCountingQuery,
        List<Predicate> predicateList
    ) {
        this.root = root;
        this.user = user;
        this.criteriaQuery = criteriaQuery;
        this.criteriaCountingQuery = criteriaCountingQuery;
        this.predicateList = predicateList;
    }

    public Root<Process> getRoot() {
        return root;
    }

    public Join<Object, Object> getUser() {
        return user;
    }

    public CriteriaQuery<Process> getCriteriaQuery() {
        return criteriaQuery;
    }

    public CriteriaQuery<Long> getCriteriaCountingQuery() {
        return criteriaCountingQuery;
    }

    public List<Predicate> getPredicateList() {
        return predicateList;
    }
}
