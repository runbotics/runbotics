package com.runbotics.repository;

import com.runbotics.domain.Process;
import java.util.List;
import java.util.Optional;
import java.util.stream.DoubleStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Process entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessRepository extends JpaRepository<Process, Long>, JpaSpecificationExecutor<Process> {
    @Query("select process from Process process where process.createdBy.login = ?#{principal.username}")
    List<Process> findByCreatedByIsCurrentUser();

    Optional<Process> findByName(String name);

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
}
