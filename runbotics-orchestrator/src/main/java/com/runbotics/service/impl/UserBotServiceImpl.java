package com.runbotics.service.impl;

import com.runbotics.domain.Bot;
import com.runbotics.domain.User;
import com.runbotics.domain.UserBot;
import com.runbotics.repository.BotRepository;
import com.runbotics.repository.UserBotRepository;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.UserBotService;
import com.runbotics.service.dto.UserBotDTO;
import com.runbotics.service.mapper.UserBotMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserBotServiceImpl implements UserBotService {

    private final Logger log = LoggerFactory.getLogger(UserBotServiceImpl.class);
    private static final String ENTITY_NAME = "jhi_user_bot";
    private final UserBotRepository userBotRepository;
    private final UserRepository userRepository;
    private final BotRepository botRepository;
    private final UserBotMapper userBotMapper;

    public UserBotServiceImpl(UserBotRepository userBotRepository, UserRepository userRepository, BotRepository botRepository, UserBotMapper userBotMapper) {
        this.userBotRepository = userBotRepository;
        this.userRepository = userRepository;
        this.botRepository = botRepository;
        this.userBotMapper = userBotMapper;
    }

    @Override
    public UserBotDTO save(UserBotDTO userBotDTO) {
        log.debug("Request to save bot subscription: {}", userBotDTO);

        User user = userRepository.findById(userBotDTO.getUserId()).orElseThrow();
        Bot bot = botRepository.findById(userBotDTO.getBotId()).orElseThrow();

        UserBot userBot = userBotMapper.toEntity(userBotDTO);
        userBot.setSubscribedAt(ZonedDateTime.now());
        userBot.setUser(user);
        userBot.setBot(bot);

        UserBot userBotRepositoryResponse = userBotRepository.save(userBot);

        return userBotMapper.toDto(userBotRepositoryResponse);
    }

    @Override
    public List<UserBotDTO> getAllSubscriptionsByBotId(Long botId) {
        log.debug("Request to get all bot subscriptions by botId: {}", botId);

        return userBotRepository
            .findAllWhereIdBotId(botId)
            .stream()
            .map(userBotMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public void delete(UserBot userBot) {
        log.debug("Request to delete bot subscription: {}", userBot);

        userBotRepository.deleteByIdUserIdAndIdBotId(
            userBot.getUser().getId(),
            userBot.getBot().getId()
        );
    }
}
