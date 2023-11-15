package com.runbotics.repository;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.domain.Process;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the GlobalVariable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GlobalVariableRepository extends JpaRepository<GlobalVariable, Long>, JpaSpecificationExecutor<GlobalVariable> {
    @Query("select globalVariable from GlobalVariable globalVariable where globalVariable.user.login = ?#{principal.username}")
    List<GlobalVariable> findByUserIsCurrentUser();

    @Query("select globalVariable.processes from GlobalVariable globalVariable where globalVariable.id = ?1")
    List<Process> getAssociatedProcesses(Long id);
}
