package com.runbotics.repository;

import com.runbotics.domain.NotificationBot;
import com.runbotics.domain.NotificationProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link NotificationBot} entity.
 */
@Repository
public interface NotificationBotRepository extends JpaRepository<NotificationBot, Long>, JpaSpecificationExecutor<NotificationBot> {

    Optional<NotificationBot> findOneByBotIdAndUserId(Long botId, Long userId);

    List<NotificationBot> findAllByBotId(Long botId);
}
