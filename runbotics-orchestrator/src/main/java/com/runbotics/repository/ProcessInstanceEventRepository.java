package com.runbotics.repository;

import com.runbotics.domain.ProcessInstanceEvent;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProcessInstanceEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessInstanceEventRepository
    extends JpaRepository<ProcessInstanceEvent, Long>, JpaSpecificationExecutor<ProcessInstanceEvent> {
    @Modifying
    @Query("delete from ProcessInstanceEvent pie where pie.processInstance.id=:processInstanceId")
    void deleteByProcessInstanceId(@Param("processInstanceId") UUID processInstanceId);
}
