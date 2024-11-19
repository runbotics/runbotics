package com.runbotics.service.impl;

import com.runbotics.domain.*;
import com.runbotics.repository.BotCollectionRepository;
import com.runbotics.service.BotCollectionService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.BotCollectionCriteria;
import com.runbotics.service.dto.BotCollectionDTO;
import com.runbotics.service.mapper.BotCollectionMapper;
import com.runbotics.utils.Utils;
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
        User requester = userService.getUserWithAuthorities().get();

        BotCollection botCollection = botCollectionMapper.toEntity(botCollectionDTO);
        botCollection.setCreatedBy(userService.getUserWithAuthorities().get());
        botCollection.setUsers(
            botCollection
                .getUsers()
                .stream()
                .map(User::getEmail)
                .map(user -> userService.getUserWithAuthoritiesByEmail(user).get())
                .collect(Collectors.toSet())
        );
        botCollection.setTenant(requester.getTenant());
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
        return botCollectionRepository.getBotCollectionByName(BotCollectionConstants.PUBLIC_COLLECTION);
    }

    @Override
    public BotCollection getGuestCollection() {
        log.debug("Getting Guest BotCollection");
        return botCollectionRepository.getBotCollectionByName(BotCollectionConstants.GUEST_COLLECTION);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BotCollectionDTO> findAll() {
        log.debug("Request to get all BotCollections");
        return botCollectionRepository.findAll().stream().map(botCollectionMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all BotCollections by page");
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
    public List<BotCollectionDTO> getAllForUser(User user) {
        log.debug("Request to get all collections for current user : {}", user.getEmail());
        BotCollection publicCollection = getPublicCollection();
        BotCollection guestCollection = getGuestCollection();

        return getCollectionsForUser(user.getId(), publicCollection, guestCollection);
    }

    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> getPageForUser(BotCollectionCriteria criteria, Pageable pageable, User user) {
        log.debug("Request to get page collections for user : {}", user.getEmail());
        Long userId = user.getId();
        List<String> commonCollections = Utils.getCommonBotCollections();

        if (criteria.getName() != null) {
            String collectionName = criteria.getName().getContains();
            return botCollectionRepository
                .findAllByUserAndByCollectionName(pageable, userId, collectionName, commonCollections)
                .map(botCollectionMapper::toDto);
        }
        if (criteria.getCreatedByName() != null) {
            String createdByName = criteria.getCreatedByName().getContains();
            return botCollectionRepository
                .findAllByUserAndByCreatedByName(pageable, userId, createdByName, commonCollections)
                .map(botCollectionMapper::toDto);
        }
        return botCollectionRepository.findAllByUser(pageable, userId, commonCollections).map(botCollectionMapper::toDto);
    }

    private List<BotCollectionDTO> getCollectionsForUser(Long userId, BotCollection publicCollection, BotCollection guestCollection) {
        List<BotCollection> collectionsForUser = botCollectionRepository.findAllByUser(userId);

        if (isCollectionInCollectionForUser(publicCollection, collectionsForUser)) {
            collectionsForUser.add(publicCollection);
        }

        if (isCollectionInCollectionForUser(guestCollection, collectionsForUser)) {
            collectionsForUser.add(guestCollection);
        }

        return collectionsForUser.stream().map(botCollectionMapper::toDto).collect(Collectors.toList());
    }

    private boolean isCollectionInCollectionForUser(BotCollection collection, List<BotCollection> collectionsForUser) {
        return !collectionsForUser.stream().map(BotCollection::getId).collect(Collectors.toList()).contains(collection.getId());
    }
}
