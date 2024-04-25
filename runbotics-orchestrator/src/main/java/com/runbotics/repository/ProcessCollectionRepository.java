package com.runbotics.repository;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.User;
import com.runbotics.domain.User;
import com.runbotics.service.dto.ProcessCollectionDTO;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessCollectionRepository extends JpaRepository<ProcessCollection, UUID>, JpaSpecificationExecutor<ProcessCollection> {
    Long countAllByTenantId(UUID tenantId);

    @Query(value = "SELECT COUNT(*) FROM ProcessCollection pc WHERE pc.id = ?1")
    int countCollectionsById(UUID id);

    @Query(
        value = "SELECT COUNT(DISTINCT pc.id) " +
        "FROM ProcessCollection pc " +
        "LEFT JOIN pc.users u " +
        "WHERE pc.id = ?1 AND " +
        "(pc.isPublic = true OR pc.createdBy = ?2 OR u = ?2)"
    )
    int countAvailableCollectionsById(UUID id, User user);

    @Query(
        value = "SELECT COUNT(DISTINCT pc.id) " +
        "FROM ProcessCollection pc " +
        "LEFT JOIN pc.users u " +
        "WHERE pc.id IN ?1 AND " +
        "(pc.isPublic = true OR pc.createdBy = ?2 OR u = ?2)"
    )
    int countAvailableCollectionsByIds(List<UUID> ids, User user);

    @Query(
        value = "SELECT DISTINCT pc " +
        "FROM ProcessCollection pc " +
        "LEFT JOIN pc.users u " +
        "WHERE pc.parentId = ?1 AND " +
        "(pc.isPublic = true OR pc.createdBy = ?2 OR u = ?2)"
    )
    Set<ProcessCollection> findAvailableChildrenCollections(UUID parentId, User user);

    @Query(
        value = "SELECT DISTINCT pc " +
        "FROM ProcessCollection pc " +
        "LEFT JOIN pc.users u " +
        "WHERE pc.parentId IS NULL AND " +
        "(pc.isPublic = true OR pc.createdBy = ?1 OR u = ?1)"
    )
    Set<ProcessCollection> findAvailableRootCollections(User user);

    @Query(value = "SELECT pc " + "FROM ProcessCollection pc " + "WHERE pc.parentId = ?1")
    List<ProcessCollection> findAllChildrenCollections(UUID parentId);

    @Query(value = "SELECT pc " + "FROM ProcessCollection pc " + "WHERE pc.parentId IS NULL")
    List<ProcessCollection> findAllRootCollections();

    @Query(value = "SELECT pc " + "FROM ProcessCollection pc " + "WHERE pc.parentId = ?1")
    List<String> findAllChildrenCollectionNames(UUID parentId);

    @Query(value = "SELECT pc " + "FROM ProcessCollection pc " + "WHERE pc.parentId IS NULL " + "AND pc.name = ?1")
    List<ProcessCollection> findAllSameNameRootCollections(String name);

    @Query(value = "SELECT pc.name " + "FROM ProcessCollection pc " + "WHERE pc.id = ?1")
    String findParentCollectionName(UUID id);

    @Query(value = "SELECT pc " + "FROM ProcessCollection pc " + "WHERE pc.parentId = ?1 AND pc.name = ?2")
    List<ProcessCollection> findSiblingWithSameName(UUID parentId, String name);

    @Query(
        value = "WITH RECURSIVE bread_crumbs AS ( " +
        "SELECT pc.*, 1 AS lvl FROM process_collection pc " +
        "WHERE pc.id = ?1 " +
        "UNION " +
        "SELECT pc.*, bc.lvl + 1 FROM bread_crumbs bc " +
        "JOIN process_collection pc ON pc.id = bc.parent_id " +
        ") " +
        "SELECT bc.id, bc.name, bc.description, bc.created, bc.updated, bc.created_by, bc.is_public, bc.parent_id, bc.tenant_id " +
        "FROM bread_crumbs bc " +
        "ORDER BY bc.lvl DESC",
        nativeQuery = true
    )
    List<ProcessCollection> findAllAncestors(UUID id);

    @Query(
        value = "SELECT DISTINCT pc " +
        "FROM ProcessCollection pc " +
        "LEFT JOIN pc.users u " +
        "WHERE pc.isPublic = true OR " +
        "pc.createdBy = ?1 OR u = ?1"
    )
    List<ProcessCollection> findAllUserAccessible(User user);

    @Query(
        value = "SELECT * FROM process_collection",
        nativeQuery = true
    )
    List<ProcessCollection> getAll();

    @Query(
        value = "SELECT pc " +
        "FROM ProcessCollection pc " +
        "LEFT JOIN pc.users u " +
        "WHERE pc.id = ?2 AND " +
        "(pc.isPublic = true OR " +
        "pc.createdBy = ?1 OR " +
        "u = ?1)"
    )
    List<ProcessCollection> findUserAccessibleById(User user, UUID id);
}
