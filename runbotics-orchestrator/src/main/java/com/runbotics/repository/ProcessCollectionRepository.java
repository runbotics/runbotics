package com.runbotics.repository;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.User;
import com.runbotics.service.dto.ProcessCollectionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProcessCollectionRepository extends JpaRepository<ProcessCollection, UUID>, JpaSpecificationExecutor<ProcessCollection> {

    @Query(value =
        "SELECT pc " +
            "FROM ProcessCollection pc " +
            "WHERE pc.parentId = ?1"
    )
    List<ProcessCollection> findAllChildrenCollections(UUID parentId);

    @Query(value =
        "SELECT pc " +
            "FROM ProcessCollection pc " +
            "WHERE pc.parentId IS NULL"
    )
    List<ProcessCollection> findAllRootCollections();

    @Query(value =
        "SELECT pc " +
            "FROM ProcessCollection pc " +
            "WHERE pc.parentId IS NULL " +
            "AND pc.name = ?1"
    )
    List<ProcessCollection> findAllSameNameRootCollections(String name);

    @Query(value =
        "SELECT pc.name " +
        "FROM ProcessCollection pc " +
        "WHERE pc.id = ?1"
    )
    String findParentCollectionName(UUID id);

    @Query(value =
        "SELECT pc " +
            "FROM ProcessCollection pc " +
            "WHERE pc.parentId = ?1 AND pc.name = ?2"
    )
    List<ProcessCollection> findSiblingWithSameName(UUID parentId, String name);

    @Query(value =
        "SELECT DISTINCT pc " +
            "FROM ProcessCollection pc " +
            "LEFT JOIN pc.users u " +
            "WHERE pc.isPublic = true OR " +
            "pc.createdBy = ?1 OR u = ?1"
    )
    List<ProcessCollection> findAllUserAccessible(User user);

}

