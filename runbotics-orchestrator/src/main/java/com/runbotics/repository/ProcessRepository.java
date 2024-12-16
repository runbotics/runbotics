package com.runbotics.repository;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;
import com.runbotics.domain.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Process entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessRepository extends JpaRepository<Process, Long>, JpaSpecificationExecutor<Process>, ProcessCustomRepository {
    Long countAllByTenantId(UUID tenantId);

    @Query("select process from Process process where process.createdBy.email = ?#{principal.username}")
    List<Process> findByCreatedByIsCurrentUser();

    @Query(
        "select process from Process process where process.createdBy.email = ?1 or process.isPublic = true"
    )
    List<Process> findByCreatedByUser(String email);

    @Query(
        "select process from Process process where process.createdBy.email = ?1 or process.isPublic = true"
    )
    Page<Process> findByCreatedByUser(String email, Pageable pageable);

    @Query(
        "select process from Process process where process.botCollection.name like %?1% and (process.createdBy.email = ?2 or process.isPublic = true)"
    )
    List<Process> findByBotCollection(String collectionName, String email);

    @Query(
        "select process from Process process where process.botCollection.name like %?1% and (process.createdBy.email = ?2 or process.isPublic = true)"
    )
    Page<Process> findByBotCollection(String collectionName, String email, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM Process process WHERE process.createdBy.id = ?1")
    int countUserProcesses(Long id);

    @Modifying
    @Query("DELETE FROM Process process WHERE process.createdBy.id IS NULL AND process.isPublic = false")
    void deleteUnassignedPrivateProcesses();

    List<Process> findAllByCreatedBy(User user);
}
