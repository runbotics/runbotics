package com.runbotics.repository;

import com.runbotics.domain.ProcessCollection;
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
        "SELECT pc.name " +
            "FROM ProcessCollection pc " +
            "WHERE pc.parentId = ?1"
    )
    List<String> findAllChildrenCollectionNames(UUID parentId);

    @Query(value =
        "SELECT pc.name " +
            "FROM ProcessCollection pc " +
            "WHERE pc.parentId IS NULL"
    )
    List<String> findAllRootCollectionNames();

    @Query(value =
        "SELECT pc.name " +
        "FROM ProcessCollection pc " +
        "WHERE pc.id = ?1"
    )
    String findParentCollectionName(UUID id);
}
