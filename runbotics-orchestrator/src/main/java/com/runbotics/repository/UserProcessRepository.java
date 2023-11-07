package com.runbotics.repository;

import com.runbotics.domain.UserProcess;
import com.runbotics.domain.UserProcessPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link UserProcess} entity.
 */
@Repository
public interface UserProcessRepository extends JpaRepository<UserProcess, UserProcessPK>, JpaSpecificationExecutor<UserProcess> {

    @Modifying
    @Query(
        value = "INSERT INTO jhi_user_process VALUES (?1, ?2, ?3)",
        nativeQuery = true
    )
    UserProcess saveByIdUserIdAndIdProcessId(Long userId, Long processId, ZonedDateTime subscribedAt);

    Optional<UserProcess> findByIdUserIdAndIdProcessId(Long userId, Long processId);

    @Modifying
    @Query(
        value = "DELETE FROM jhi_user_process jup WHERE jup.user_id = ?1 AND jup.process_id = ?2",
        nativeQuery = true
    )
    void deleteByIdUserIdAndIdProcessId(Long userId, Long processId);
}
