package com.runbotics.service;

import com.runbotics.domain.NotificationBot;
import com.runbotics.service.dto.NotificationBotCreateDTO;
import com.runbotics.service.dto.NotificationBotDTO;

import java.util.List;
import java.util.Optional;

public interface NotificationBotService {
    /**
     * Creates subscription for bot notifications
     *
     * @param notificationBotCreateDTO
     */
    NotificationBotDTO save(NotificationBotCreateDTO notificationBotCreateDTO);

    /**
     * Gets all subscriptions for bot notifications
     *
     * @param botId
     */
    List<NotificationBotDTO> getAllSubscriptionsByBotId(Long botId);

    /**
     * Get subscription for bot notification
     *
     * @param botId
     * @param userId
     */
    Optional<NotificationBotDTO> getSubscriptionByBotIdAndUserId(Long botId, Long userId);

    /**
     * Removes subscription for bot notifications
     *
     * @param notificationBot
     */
    void delete(NotificationBot notificationBot);
}
