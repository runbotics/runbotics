package com.runbotics.service.impl;

import com.runbotics.domain.*;
import com.runbotics.repository.BotCollectionRepository;
import com.runbotics.service.BotCollectionService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.BotCollectionCriteria;
import com.runbotics.service.dto.BotCollectionDTO;
import com.runbotics.service.mapper.BotCollectionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.criteria.JoinType;

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
        return botCollectionRepository.getBotCollectionByName(BotCollectionConstants.PUBLIC_COLLECTION);
    }

    @Override
    public BotCollection getGuestCollection() {
        log.debug("Getting Guest BotCollection");
        return botCollectionRepository.getBotCollectionByName(BotCollectionConstants.GUEST_COLLECTION);
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
        BotCollection guestCollection = getGuestCollection();

        return getCollectionsForUser(username, publicCollection, guestCollection);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> findPageForUser(String username, Pageable pageable) {
        log.debug("Request to get page collections for user : {}", username);
        
        return botCollectionRepository
            .findDistinctByCreatedByLoginOrUsers_Login(username, username, pageable)
            .map(botCollectionMapper::toDto);
    }

    private List<BotCollectionDTO> getCollectionsForUser(String username, BotCollection publicCollection, BotCollection guestCollection) {
        List<BotCollection> collectionsForUser = botCollectionRepository.findDistinctByCreatedByLoginOrUsers_Login(username, username);

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
