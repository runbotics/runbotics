package com.runbotics.repository;

import com.runbotics.domain.Process;

import java.util.List;
import java.util.UUID;

import com.runbotics.domain.User;
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

    @Query(value =
        "SELECT p.* FROM process p " +
            "LEFT JOIN tag_process tp ON p.id = tp.process_id " +
            "LEFT JOIN tag t ON tp.tag_id = t.id " +
            "LEFT JOIN jhi_user u ON u.id = p.created_by_id " +
            "WHERE (p.name iLIKE %:name% OR t.name iLIKE %:tagName% OR u.email iLIKE %:createdByName%) " +
            "GROUP BY p.id"
        , nativeQuery = true
    )
    Page<Process> findBySearchForAdmin(String name, String tagName, String createdByName, Pageable pageable);

    @Query(value =
        "SELECT p.* FROM process p " +
            "LEFT JOIN tag_process tp ON p.id = tp.process_id " +
            "LEFT JOIN tag t ON tp.tag_id = t.id " +
            "LEFT JOIN jhi_user u ON u.id = p.created_by_id " +
            "WHERE u.id NOT IN (SELECT g.user_id FROM guest g) " +
            "AND (p.created_by_id = :id OR p.is_public = true) " +
            "AND (p.name iLIKE %:name% OR t.name iLIKE %:tagName% OR u.email iLIKE %:createdByName%) " +
            "GROUP BY p.id"
        , nativeQuery = true
    )
    Page<Process> findBySearchForUser(Long id, String name, String tagName, String createdByName, Pageable pageable);

    @Query(value =
        "SELECT p.* FROM process p " +
            "LEFT JOIN tag_process tp ON p.id = tp.process_id " +
            "LEFT JOIN tag t ON tp.tag_id = t.id " +
            "LEFT JOIN jhi_user u ON u.id = p.created_by_id " +
            "WHERE p.collection_id = :collectionId " +
            "AND (p.name iLIKE %:name% OR t.name iLIKE %:tagName% OR u.email iLIKE %:createdByName%) " +
            "GROUP BY p.id"
        , nativeQuery = true
    )
    Page<Process> findBySearchAndCollectionForAdmin(String name, String tagName, String createdByName, UUID collectionId, Pageable pageable);

    @Query(value =
        "SELECT p.* FROM process p " +
            "LEFT JOIN tag_process tp ON p.id = tp.process_id " +
            "LEFT JOIN tag t ON tp.tag_id = t.id " +
            "LEFT JOIN jhi_user u ON u.id = p.created_by_id " +
            "WHERE u.id NOT IN (SELECT g.user_id FROM guest g) " +
            "AND (p.created_by_id = :id OR p.is_public = true) " +
            "AND p.collection_id = :collectionId " +
            "AND (p.name iLIKE %:name% OR t.name iLIKE %:tagName% OR u.email iLIKE %:createdByName%) " +
            "GROUP BY p.id"
        , nativeQuery = true
    )
    Page<Process> findBySearchAndCollectionForUser(Long id, String name, String tagName, String createdByName, UUID collectionId, Pageable pageable);

    @Query(value =
        "SELECT p.* FROM process p " +
            "LEFT JOIN tag_process tp ON p.id = tp.process_id " +
            "LEFT JOIN tag t ON tp.tag_id = t.id " +
            "LEFT JOIN jhi_user u ON u.id = p.created_by_id " +
            "WHERE p.collection_id IS NULL " +
            "AND (p.name iLIKE %:name% OR t.name iLIKE %:tagName% OR u.email iLIKE %:createdByName%) " +
            "GROUP BY p.id"
        , nativeQuery = true
    )
    Page<Process> findBySearchWithoutCollectionForAdmin(String name, String tagName, String createdByName, Pageable pageable);

    @Query(value =
        "SELECT p.* FROM process p " +
            "LEFT JOIN tag_process tp ON p.id = tp.process_id " +
            "LEFT JOIN tag t ON tp.tag_id = t.id " +
            "LEFT JOIN jhi_user u ON u.id = p.created_by_id " +
            "WHERE u.id NOT IN (SELECT g.user_id FROM guest g) " +
            "AND (p.created_by_id = :id OR p.is_public = true) " +
            "AND p.collection_id IS NULL " +
            "AND (p.name iLIKE %:name% OR t.name iLIKE %:tagName% OR u.email iLIKE %:createdByName%) " +
            "GROUP BY p.id"
        , nativeQuery = true
    )
    Page<Process> findBySearchWithoutCollectionForUser(Long id, String name, String tagName, String createdByName, Pageable pageable);

    @Query(
        value = "SELECT COUNT(*) FROM Process process WHERE process.createdBy.id = ?1"
    )
    int countUserProcesses(Long id);

    @Modifying
    @Query(
        "DELETE FROM Process process WHERE process.createdBy.id IS NULL AND process.isPublic = false"
    )
    void deleteUnassignedPrivateProcesses();

    List<Process> findAllByCreatedBy(User user);
}
