package com.runbotics.service;

import com.runbotics.domain.NotificationBot;
import com.runbotics.service.dto.NotificationBotDTO;

import java.util.List;

public interface NotificationBotService {
    /**
     * Creates subscription for bot notifications
     *
     * @param notificationBotDTO
     */
    NotificationBotDTO save(NotificationBotDTO notificationBotDTO);

    /**
     * Gets all subscriptions for bot notifications
     *
     * @param botId
     */
    List<NotificationBotDTO> getAllSubscriptionsByBotId(Long botId);


    /**
     * Removes subscription for bot notifications
     *
     * @param notificationBot
     */
    void delete(NotificationBot notificationBot);
}
