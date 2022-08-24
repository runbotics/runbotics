package com.runbotics.repository;

import com.runbotics.domain.Action;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Action entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActionRepository extends JpaRepository<Action, String>, JpaSpecificationExecutor<Action> {}
