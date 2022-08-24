package com.runbotics.service.impl;

import com.runbotics.domain.Bot;
import com.runbotics.repository.BotRepository;
import com.runbotics.service.BotService;
import com.runbotics.service.dto.BotDTO;
import com.runbotics.service.mapper.BotMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Bot}.
 */
@Service
@Transactional
public class BotServiceImpl implements BotService {

    private final Logger log = LoggerFactory.getLogger(BotServiceImpl.class);

    private final BotRepository botRepository;

    private final BotMapper botMapper;

    public BotServiceImpl(BotRepository botRepository, BotMapper botMapper) {
        this.botRepository = botRepository;
        this.botMapper = botMapper;
    }

    @Override
    public BotDTO save(BotDTO botDTO) {
        log.debug("Request to save Bot : {}", botDTO);
        Bot bot = botMapper.toEntity(botDTO);
        bot = botRepository.save(bot);
        return botMapper.toDto(bot);
    }

    @Override
    public Optional<BotDTO> partialUpdate(BotDTO botDTO) {
        log.debug("Request to partially update Bot : {}", botDTO);

        return botRepository
            .findById(botDTO.getId())
            .map(
                existingBot -> {
                    botMapper.partialUpdate(existingBot, botDTO);
                    return existingBot;
                }
            )
            .map(botRepository::save)
            .map(botMapper::toDto);
    }

    @Override
    @Transactional
    public List<BotDTO> saveAll(List<BotDTO> bots) {
        var savedBots = botRepository.saveAll(botMapper.toEntity(bots));
        return botMapper.toDto(savedBots);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BotDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Bots");
        return botRepository.findAll(pageable).map(botMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BotDTO> findOne(Long id) {
        log.debug("Request to get Bot : {}", id);
        return botRepository.findById(id).map(botMapper::toDto);
    }

    @Override
    public Optional<BotDTO> findByInstallationId(String installationId) {
        log.debug("Request to get Bot : {}", installationId);
        return botRepository.findByInstallationId(installationId).map(botMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Bot : {}", id);
        botRepository.deleteById(id);
    }

    @Override
    public Page<BotDTO> getBotsWithCollection(Pageable pageable, List<String> collectionsNames, String login) {
        if (collectionsNames.isEmpty()) {
            return botRepository.getAllAvailableToCurrentUser(pageable, login)
                .map(botMapper::toDto);
        }
        return botRepository.getAllAvailableToCurrentUserWithTags(pageable, login, collectionsNames)
            .map(botMapper::toDto);
    }
}
