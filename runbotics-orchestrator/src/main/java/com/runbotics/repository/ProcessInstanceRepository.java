package com.runbotics.repository;

import com.runbotics.domain.ProcessInstance;
import com.runbotics.modules.bot.entity.ProcessInstanceStatus;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProcessInstance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessInstanceRepository extends JpaRepository<ProcessInstance, UUID>, JpaSpecificationExecutor<ProcessInstance> {
    Set<ProcessInstance> findAllByProcessId(Long processId);

    @Query(value = "SELECT * FROM process_instance WHERE bot_id = ?1 ORDER BY updated DESC LIMIT 1", nativeQuery = true)
    Optional<ProcessInstance> findLatestRecordByBotId(Long botId);

    @Query("SELECT process_instance FROM ProcessInstance process_instance WHERE process_instance.process.name like %?1%")
    Page<ProcessInstance> findAllByProcessName(String processName, Pageable pageable);

    @Query("SELECT process_instance FROM ProcessInstance process_instance WHERE process_instance.bot.installationId like %?1%")
    Page<ProcessInstance> findAllByBotInstallationId(String botId, Pageable pageable);

    @Query("SELECT process_instance FROM ProcessInstance process_instance WHERE process_instance.status IN ?1 AND process_instance.rootProcessInstanceId IS NULL")
    List<ProcessInstance> findByStatus(List<ProcessInstanceStatus> status);

    @Query("SELECT process_instance FROM ProcessInstance process_instance WHERE process_instance.user.login like %?1%")
    Page<ProcessInstance> findAllByCreatedByName(String username, Pageable pageable);

    @Query("SELECT process_instance FROM ProcessInstance process_instance WHERE process_instance.parentProcessInstanceId = ?1")
    List<ProcessInstance> findByParentId(UUID parentId);

    @Modifying
    @Query("DELETE FROM ProcessInstance pi WHERE pi.process.id IS NULL")
    void deleteInstancesWithoutProcess();
}
