package com.runbotics.service.impl;

import com.runbotics.domain.BotCollection;
import com.runbotics.domain.User;
import com.runbotics.repository.BotCollectionRepository;
import com.runbotics.service.BotCollectionService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.BotCollectionDTO;
import com.runbotics.service.mapper.BotCollectionMapper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BotCollectionServiceImpl implements BotCollectionService {

    private final String PUBLIC_COLLECTION = "Public";
    private final Logger log = LoggerFactory.getLogger(BotServiceImpl.class);

    private final BotCollectionRepository botCollectionRepository;

    private final BotCollectionMapper botCollectionMapper;

    private final UserService userService;

    public BotCollectionServiceImpl(
        BotCollectionRepository botCollectionRepository,
        BotCollectionMapper botCollectionMapper,
        UserService userService
    ) {
        this.botCollectionRepository = botCollectionRepository;
        this.botCollectionMapper = botCollectionMapper;
        this.userService = userService;
    }

    @Override
    public BotCollectionDTO save(BotCollectionDTO botCollectionDTO) {
        log.debug("Request to save BotCollection : {}", botCollectionDTO);
        BotCollection botCollection = botCollectionMapper.toEntity(botCollectionDTO);
        botCollection.setCreatedBy(userService.getUserWithAuthorities().get());
        botCollection.setUsers(
            botCollection
                .getUsers()
                .stream()
                .map(User::getLogin)
                .map(user -> userService.getUserWithAuthoritiesByLogin(user).get())
                .collect(Collectors.toSet())
        );
        botCollection = botCollectionRepository.save(botCollection);
        return botCollectionMapper.toDto(botCollection);
    }

    @Override
    public Optional<BotCollectionDTO> partialUpdate(BotCollectionDTO botCollectionDTO) {
        log.debug("Request to partially update BotCollection : {}", botCollectionDTO);

        return botCollectionRepository
            .findById(botCollectionDTO.getId())
            .map(
                existingCollectionBot -> {
                    botCollectionMapper.partialUpdate(existingCollectionBot, botCollectionDTO);
                    return existingCollectionBot;
                }
            )
            .map(botCollectionRepository::save)
            .map(botCollectionMapper::toDto);
    }

    @Override
    public BotCollection getPublicCollection() {
        log.debug("Getting Public BotCollection");
        return botCollectionRepository.getBotCollectionByName(PUBLIC_COLLECTION);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all BotCollections");
        return botCollectionRepository.findAll(pageable).map(botCollectionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BotCollectionDTO> findOne(UUID id) {
        log.debug("Request to get BotCollection : {}", id);
        return botCollectionRepository.findById(id).map(botCollectionMapper::toDto);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Request to delete BotCollection : {}", id);
        botCollectionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BotCollectionDTO> findAllForUser(String username) {
        log.debug("Request to get all collections for current user : {}", username);
        BotCollection publicCollection = getPublicCollection();
        return getCollectionsForUser(username, publicCollection);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> findPageForUser(String username, Pageable pageable) {
        log.debug("Request to get page collections for user : {}", username);
        return botCollectionRepository
            .findDistinctByCreatedByLoginOrUsers_Login(username, username, pageable)
            .map(botCollectionMapper::toDto);
    }

    private List<BotCollectionDTO> getCollectionsForUser(String username, BotCollection publicCollection) {
        List<BotCollection> collectionsForUser = botCollectionRepository.findDistinctByCreatedByLoginOrUsers_Login(username, username);

        if (!isPublicCollectionInCollectionForUser(publicCollection, collectionsForUser)) {
            collectionsForUser.add(publicCollection);
        }
        return collectionsForUser.stream().map(botCollectionMapper::toDto).collect(Collectors.toList());
    }

    private boolean isPublicCollectionInCollectionForUser(BotCollection publicCollection, List<BotCollection> collectionsForUser) {
        return collectionsForUser.stream().map(BotCollection::getId).collect(Collectors.toList()).contains(publicCollection.getId());
    }
}
