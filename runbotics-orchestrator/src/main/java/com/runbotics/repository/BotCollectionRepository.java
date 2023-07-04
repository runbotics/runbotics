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

    Page<BotCollection> findDistinctByCreatedByLoginOrUsers_Login(String login, String login1, Pageable pageable);

    Page<BotCollection> findDistinctByPublicBotsIncludedAndCreatedByLoginOrUsers_Login(
        boolean publicBotsIncluded,
        String login,
        String login1,
        Pageable pageable
    );

    @Query(value =
        "SELECT DISTINCT " +
            "id, " +
            "name, " +
            "description, " +
            "public_bots_included, " +
            "created, " +
            "updated, " +
            "created_by " +
            "FROM (bot_collection_user RIGHT JOIN bot_collection ON created_by = user_id) AS collections " +
            "WHERE user_id = :id OR created_by = :id OR name IN ('Public','Guest')",
        countQuery =
            "SELECT DISTINCT " +
                "count(*) " +
                "FROM (bot_collection_user as b RIGHT JOIN bot_collection ON created_by = user_id) AS collections " +
                "WHERE user_id = :id OR created_by = :id OR name IN ('Public','Guest')"
        , nativeQuery = true
    )
    Page<BotCollection> findAllUserCollections(
        Long id,
        Pageable pageable
    );

    @Query(
        value =
            "SELECT DISTINCT * FROM ( " +
                "SELECT DISTINCT " +
                "id, " +
                "name, " +
                "description, " +
                "public_bots_included, " +
                "created, " +
                "updated, " +
                "created_by " +
                "FROM (bot_collection_user RIGHT JOIN bot_collection ON created_by = user_id) AS collections " +
                "WHERE (user_id = :id OR created_by = :id OR name IN ('Public','Guest'))) as collections WHERE name ILIKE %:collectionName%",
        countQuery =
            "SELECT DISTINCT count(*) FROM ( " +
                "SELECT DISTINCT " +
                "id, " +
                "name, " +
                "description, " +
                "public_bots_included, " +
                "created, " +
                "updated, " +
                "created_by " +
                "FROM (bot_collection_user RIGHT JOIN bot_collection ON created_by = user_id) AS collections " +
                "WHERE (user_id = :id OR created_by = :id OR name IN ('Public','Guest'))) as collections WHERE name ILIKE %:collectionName%",

        nativeQuery = true
    )
    Page<BotCollection> findAllUserCollectionsByNames(
        Long id,
        String collectionName,
        Pageable pageable
    );

    Page<BotCollection> findDistinctByCreatedByLoginContains(String login, Pageable pageable);

}
