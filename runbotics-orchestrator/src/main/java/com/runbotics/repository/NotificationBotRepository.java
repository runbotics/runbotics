package com.runbotics.repository;

import com.runbotics.domain.NotificationBot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link NotificationBot} entity.
 */
@Repository
public interface NotificationBotRepository extends JpaRepository<NotificationBot, Long> {

    Optional<NotificationBot> findByUserIdAndBotId(Long userId, Long botId);

    List<NotificationBot> findAllByBotId(Long botId);
}
