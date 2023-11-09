package com.runbotics.service;

import com.runbotics.domain.UserBot;
import com.runbotics.service.dto.UserBotDTO;

import java.util.List;

public interface UserBotService {
    /**
     * Creates subscription for bot notifications
     *
     * @param userBotDTO
     */
    UserBotDTO save(UserBotDTO userBotDTO);

    /**
     * Gets all subscriptions for bot notifications
     *
     * @param botId
     */
    List<UserBotDTO> getAllSubscriptionsByBotId(Long botId);


    /**
     * Removes subscription for bot notifications
     *
     * @param userBot
     */
    void delete(UserBot userBot);
}
