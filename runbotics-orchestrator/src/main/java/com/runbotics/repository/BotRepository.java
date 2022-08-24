package com.runbotics.repository;

import com.runbotics.domain.Bot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data SQL repository for the Bot entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BotRepository extends JpaRepository<Bot, Long>, JpaSpecificationExecutor<Bot> {

    @Query("SELECT bot FROM Bot bot WHERE bot.user.login = ?#{principal.username}")
    List<Bot> findByUserIsCurrentUser();

    Optional<Bot> findByInstallationId(String installationId);

    @Query(value =
            "SELECT DISTINCT b FROM Bot b " +
            "LEFT JOIN b.collection.users u " +
            "WHERE (b.collection.name IN :names) AND (:login = u.login OR b.collection.createdBy.login = :login)")
    Page<Bot> getAllAvailableToCurrentUserWithTags(Pageable pageable, String login, List<String> names);

    @Query(value =
            "SELECT DISTINCT b FROM Bot b " +
            "LEFT JOIN b.collection.users u " +
            "WHERE :login = u.login OR b.collection.createdBy.login = :login")
    Page<Bot> getAllAvailableToCurrentUser(Pageable pageable, String login);

}
