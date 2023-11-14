package com.runbotics.service.impl;

import com.runbotics.domain.Bot;
import com.runbotics.domain.NotificationBot;
import com.runbotics.domain.NotificationType;
import com.runbotics.domain.User;
import com.runbotics.repository.BotRepository;
import com.runbotics.repository.NotificationBotRepository;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.NotificationBotService;
import com.runbotics.service.dto.NotificationBotDTO;
import com.runbotics.service.mapper.NotificationBotMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationBotServiceImpl implements NotificationBotService {

    private final Logger log = LoggerFactory.getLogger(NotificationBotServiceImpl.class);
    private static final String ENTITY_NAME = "notification_bot";
    private final NotificationBotRepository notificationBotRepository;
    private final UserRepository userRepository;
    private final BotRepository botRepository;
    private final NotificationBotMapper notificationBotMapper;

    public NotificationBotServiceImpl(NotificationBotRepository notificationBotRepository, UserRepository userRepository, BotRepository botRepository, NotificationBotMapper notificationBotMapper) {
        this.notificationBotRepository = notificationBotRepository;
        this.userRepository = userRepository;
        this.botRepository = botRepository;
        this.notificationBotMapper = notificationBotMapper;
    }

    @Override
    public NotificationBotDTO save(NotificationBotDTO notificationBotDTO) {
        log.debug("Request to save bot subscription: {}", notificationBotDTO);

        User user = userRepository.findById(notificationBotDTO.getUserId()).orElseThrow();
        Bot bot = botRepository.findById(notificationBotDTO.getBotId()).orElseThrow();

        NotificationBot notificationBot = notificationBotMapper.toEntity(notificationBotDTO);
        notificationBot.setType(NotificationType.NotificationTypeName.BOT.value());
        notificationBot.setCreatedAt(ZonedDateTime.now());
        notificationBot.setUser(user);
        notificationBot.setBot(bot);

        NotificationBot userBotRepositoryResponse = notificationBotRepository.save(notificationBot);

        return notificationBotMapper.toDto(userBotRepositoryResponse);
    }

    @Override
    public List<NotificationBotDTO> getAllSubscriptionsByBotId(Long botId) {
        log.debug("Request to get all bot subscriptions by botId: {}", botId);

        return notificationBotRepository
            .findAllByBotId(botId)
            .stream()
            .map(notificationBotMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public void delete(NotificationBot notificationBot) {
        log.debug("Request to delete bot subscription: {}", notificationBot);

        notificationBotRepository.delete(notificationBot);
    }
}
