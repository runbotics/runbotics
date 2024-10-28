package com.runbotics.repository;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.domain.Process;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the GlobalVariable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GlobalVariableRepository extends JpaRepository<GlobalVariable, Long>, JpaSpecificationExecutor<GlobalVariable> {
}
