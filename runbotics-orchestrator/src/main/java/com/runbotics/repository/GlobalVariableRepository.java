package com.runbotics.repository;

import com.runbotics.domain.GlobalVariable;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the GlobalVariable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GlobalVariableRepository extends JpaRepository<GlobalVariable, Long>, JpaSpecificationExecutor<GlobalVariable> {
    @Query("select globalVariable from GlobalVariable globalVariable where globalVariable.user.login = ?#{principal.username}")
    List<GlobalVariable> findByUserIsCurrentUser();
}
