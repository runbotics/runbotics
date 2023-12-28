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
        "WHERE b.collection.name IN :collectionNames"
    )
    Page<Bot> getAllWithSelectedCollections(Pageable pageable, List<String> collectionNames);

    @Query(value =
        "SELECT DISTINCT b FROM Bot b " +
        "LEFT JOIN b.collection.users u " +
        "WHERE u.id = :userId OR b.collection.createdBy.id = :userId OR b.collection.name IN :commonCollections"
    )
    Page<Bot> getAllByUser(Pageable pageable, Long userId, List<String> commonCollections);

    @Query(value =
        "SELECT DISTINCT b FROM Bot b " +
        "LEFT JOIN b.collection.users u " +
        "WHERE (u.id = :userId OR b.collection.createdBy.id = :userId OR b.collection.name IN :commonCollections)" +
        "AND b.collection.name IN :collectionNames"
    )
    Page<Bot> getAllByUserAndWithSelectedCollections(
        Pageable pageable,
        Long userId,
        List<String> collectionNames,
        List<String> commonCollections
    );
}
