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

    List<BotCollection> findDistinctByCreatedByLoginOrUsers_Login(String login, String login1);

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE (u.id = :userId OR bc.createdBy.id = :userId OR bc.name LIKE 'Public') AND bc.name LIKE %:collectionName%"
    )
    Page<BotCollection> getAllByUserAndByName(Pageable pageable, Long userId, String collectionName);

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE (u.id = :userId OR bc.createdBy.id = :userId OR bc.name LIKE 'Public') AND bc.createdBy.email LIKE %:createdByName%"
    )
    Page<BotCollection> getAllByUserAndByCreatedBy(Pageable pageable, Long userId, String createdByName);

    @Query(value =
        "SELECT DISTINCT bc FROM BotCollection bc " +
        "LEFT JOIN bc.users u " +
        "WHERE u.id = :userId OR bc.createdBy.id = :userId OR bc.name LIKE 'Public'"
    )
    Page<BotCollection> getAllByUser(Pageable pageable, Long userId);
}
