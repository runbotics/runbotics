package com.runbotics.repository;

import com.runbotics.domain.ProcessInstanceLoopEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the ProcessInstanceEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessInstanceLoopEventRepository
    extends JpaRepository<ProcessInstanceLoopEvent, Long>, JpaSpecificationExecutor<ProcessInstanceLoopEvent> {
    List<ProcessInstanceLoopEvent> findByLoopId(String loopId);

}
