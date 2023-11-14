package com.runbotics.repository;

import com.runbotics.domain.NotificationProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link NotificationProcess} entity.
 */
@Repository
public interface NotificationProcessRepository extends JpaRepository<NotificationProcess, Long>, JpaSpecificationExecutor<NotificationProcess> {

    Optional<NotificationProcess> findByUserIdAndProcessId(Long userId, Long processId);

    List<NotificationProcess> findAllByProcessId(Long processId);
}
