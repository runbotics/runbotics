package com.runbotics.repository;

import com.runbotics.domain.BotCollection;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface BotCollectionRepository extends JpaRepository<BotCollection, UUID>, JpaSpecificationExecutor<BotCollection> {
    BotCollection getBotCollectionByName(String name);

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE u.id = :userId OR bc.createdBy.id = :userId"
    )
    List<BotCollection> findAllByUser(Long userId);

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE (u.id = :userId " +
            "OR bc.createdBy.id = :userId " +
            "OR bc.name IN :commonCollections" +
        ") " +
        "AND bc.name LIKE %:collectionName%"
    )
    Page<BotCollection> findAllByUserAndByCollectionName(
        Pageable pageable,
        Long userId,
        String collectionName,
        List<String> commonCollections
    );

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE (u.id = :userId " +
            "OR bc.createdBy.id = :userId " +
            "OR bc.name IN :commonCollections" +
        ") " +
        "AND bc.createdBy.email LIKE %:createdByName%"
    )
    Page<BotCollection> findAllByUserAndByCreatedByName(
        Pageable pageable,
        Long userId,
        String createdByName,
        List<String> commonCollections
    );

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE u.id = :userId " +
            "OR bc.createdBy.id = :userId " +
            "OR bc.name IN :commonCollections"
    )
    Page<BotCollection> findAllByUser(
        Pageable pageable,
        Long userId,
        List<String> commonCollections
    );
}
