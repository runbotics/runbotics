package com.runbotics.repository;

import com.runbotics.domain.UserBot;
import com.runbotics.domain.UserBotPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link UserBot} entity.
 */
@Repository
public interface UserBotRepository extends JpaRepository<UserBot, UserBotPK> {

    Optional<UserBot> findByIdUserIdAndIdBotId(Long userId, Long botId);

    @Query(
        value = "SELECT * FROM jhi_user ju INNER JOIN jhi_user_bot jub ON ju.id = jub.user_id WHERE jub.bot_id = ?1",
        nativeQuery = true
    )
    List<UserBot> findAllWhereIdBotId(Long botId);

    @Modifying
    @Query(
        value = "DELETE FROM jhi_user_bot jub WHERE jub.user_id = ?1 AND jub.bot_id = ?2",
        nativeQuery = true
    )
    void deleteByIdUserIdAndIdBotId(Long userId, Long botId);
}
