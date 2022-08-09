package com.runbotics.repository;

import com.runbotics.domain.Process;
import com.runbotics.domain.ScheduleProcess;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ScheduleProcess entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScheduleProcessRepository extends JpaRepository<ScheduleProcess, Long>, JpaSpecificationExecutor<ScheduleProcess> {
    List<ScheduleProcess> findAllByProcess(Process process);
}
