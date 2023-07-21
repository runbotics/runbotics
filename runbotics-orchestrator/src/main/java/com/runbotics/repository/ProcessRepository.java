package com.runbotics.repository;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Process entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessRepository extends JpaRepository<Process, Long>, JpaSpecificationExecutor<Process> {
    @Query("select process from Process process where process.createdBy.login = ?#{principal.username}")
    List<Process> findByCreatedByIsCurrentUser();

    @Query(
        "select process from Process process where process.createdBy.login like %?1% and (process.createdBy.login = ?2 or process.isPublic = true)"
    )
    List<Process> findByCreatedByUser(String username, String userLogin);

    @Query(
        "select process from Process process where process.createdBy.login like %?1% and (process.createdBy.login = ?2 or process.isPublic = true)"
    )
    Page<Process> findByCreatedByUser(String username, String userLogin, Pageable pageable);

    @Query(
        "select process from Process process where process.botCollection.name like %?1% and (process.createdBy.login = ?2 or process.isPublic = true)"
    )
    List<Process> findByBotCollection(String collectionName, String userLogin);

    @Query(
        "select process from Process process where process.botCollection.name like %?1% and (process.createdBy.login = ?2 or process.isPublic = true)"
    )
    Page<Process> findByBotCollection(String collectionName, String userLogin, Pageable pageable);

    @Query(
        "DELETE FROM Process process WHERE process.createdBy IS NULL AND process.isPublic = false"
    )
    void deleteUnassignedPrivateProcesses();

    List<Process> findAllByCreatedBy(User user);
}
