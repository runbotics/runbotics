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
        "SELECT DISTINCT * FROM (" +
            "SELECT DISTINCT *" +
            "FROM bot_collection b " +
            "WHERE b.id = ( " +
            "SELECT col.id " +
            "FROM bot_collection col inner join jhi_user u " +
            "ON col.created_by = u.id " +
            "WHERE u.login = :login) OR public_bots_included = :publicBotsIncluded " +
            "UNION " +
            "SELECT DISTINCT * " +
            "FROM bot_collection b " +
            "WHERE b.id = ( " +
            "SELECT col.bot_collection_id " +
            "FROM bot_collection_user col inner join jhi_user u " +
            "ON col.user_id = u.id " +
            "WHERE u.login = :login) " +
            "UNION SELECT * FROM bot_collection " +
            "WHERE name IN ('Public','Guest')) AS b ",
        countQuery =
            "SELECT count(*) FROM ( " +
                "SELECT DISTINCT * " +
                "FROM bot_collection b " +
                "WHERE b.id = ( " +
                "SELECT col.id " +
                "FROM bot_collection col inner join jhi_user u " +
                "ON col.created_by = u.id " +
                "WHERE u.login = 'user') OR public_bots_included = true " +
                "UNION " +
                "SELECT DISTINCT * " +
                "FROM bot_collection b " +
                "WHERE b.id = ( " +
                "SELECT col.bot_collection_id " +
                "FROM bot_collection_user col inner join jhi_user u " +
                "ON col.user_id = u.id " +
                "WHERE u.login = 'user') " +
                "UNION SELECT * FROM bot_collection " +
                "WHERE name IN ('Public','Guest')) as b"
        , nativeQuery = true
    )
    Page<BotCollection> findDistinctByPublicBotsIncludedAndCreatedByLoginOrUsers(
        boolean publicBotsIncluded,
        String login,
        Pageable pageable
    );

    @Query(
        value =
            "SELECT DISTINCT * FROM ( " +
                "SELECT DISTINCT * " +
                "FROM bot_collection b " +
                "WHERE b.id = ( " +
                "SELECT col.id " +
                "FROM bot_collection col inner join jhi_user u " +
                "ON col.created_by = u.id " +
                "WHERE u.login = :login) OR public_bots_included = :publicBotsIncluded " +
                "UNION " +
                "SELECT DISTINCT * " +
                "FROM bot_collection " +
                "b WHERE b.id = ( " +
                "SELECT col.bot_collection_id " +
                "FROM bot_collection_user col inner join jhi_user u " +
                "ON col.user_id = u.id " +
                "WHERE u.login = :login) " +
                "UNION " +
                "SELECT * FROM bot_collection " +
                "WHERE name IN ('Public','Guest')) " +
                "as b WHERE name ILIKE %:collectionName%",
        countQuery =
            "SELECT DISTINCT COUNT(*) FROM ( " +
                "SELECT DISTINCT * " +
                "FROM bot_collection b " +
                "WHERE b.id = ( " +
                "SELECT col.id " +
                "FROM bot_collection col inner join jhi_user u " +
                "ON col.created_by = u.id " +
                "WHERE u.login = :login) OR public_bots_included = :publicBotsIncluded " +
                "UNION " +
                "SELECT DISTINCT * " +
                "FROM bot_collection " +
                "b WHERE b.id = ( " +
                "SELECT col.bot_collection_id " +
                "FROM bot_collection_user col inner join jhi_user u " +
                "ON col.user_id = u.id " +
                "WHERE u.login = :login) " +
                "UNION " +
                "SELECT * FROM bot_collection " +
                "WHERE name IN ('Public','Guest')) " +
                "as b WHERE name ILIKE %:collectionName%",
        nativeQuery = true
    )
    Page<BotCollection> findDistinctByPublicBotsIncludedAndCreatedByLoginOrUsersAndCollectionName(
        boolean publicBotsIncluded,
        String login,
        String collectionName,
        Pageable pageable
    );

    Page<BotCollection> findDistinctByCreatedByLoginContains(String login, Pageable pageable);

}
