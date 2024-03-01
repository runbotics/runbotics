package com.runbotics.service.impl;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.User;
import com.runbotics.repository.ProcessCollectionRepository;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.ProcessCollectionService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.ProcessCollectionDTO;
import com.runbotics.service.ProcessCollectionQueryService;
import com.runbotics.service.mapper.ProcessCollectionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public  class ProcessCollectionServiceImpl implements ProcessCollectionService {

    private final Logger log = LoggerFactory.getLogger(ProcessCollectionServiceImpl.class);

    private final ProcessCollectionRepository processCollectionRepository;

    private final ProcessCollectionQueryService processCollectionQueryService;

    private final ProcessCollectionMapper processCollectionMapper;

    private final UserService userService;

    public ProcessCollectionServiceImpl(
        ProcessCollectionRepository processCollectionRepository,
        ProcessCollectionMapper processCollectionMapper,
        UserService userService,
        ProcessCollectionQueryService processCollectionQueryService
    ) {
        this.processCollectionRepository = processCollectionRepository;
        this.processCollectionMapper = processCollectionMapper;
        this.processCollectionQueryService = processCollectionQueryService;
        this.userService = userService;
    }

    public void checkCollectionAvailability(
        UUID collectionId, User user
    ) throws ResponseStatusException {
        if (processCollectionRepository.countCollectionsById(collectionId) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cannot find process collection");
        }

        boolean hasUserAccessEveryCollection = user.getFeatureKeys().contains(FeatureKeyConstants.PROCESS_COLLECTION_ALL_ACCESS);
        if (!hasUserAccessEveryCollection) {
            boolean isCollectionAvailable = !(processCollectionRepository.countAvailableCollectionsById(collectionId, user) == 0);
            if (!isCollectionAvailable) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to process collection");
            }
        }
    }

    public List<ProcessCollectionDTO> getChildrenCollectionsByRoot(User user) {
        boolean hasUserAccessEveryCollection = user.getFeatureKeys().contains(FeatureKeyConstants.PROCESS_COLLECTION_ALL_ACCESS);

        if (hasUserAccessEveryCollection) {
            return processCollectionMapper.toDto(processCollectionRepository.findAllRootCollections());
        }

        Set<ProcessCollection> result = processCollectionRepository.findAvailableRootCollections(user);
        return processCollectionMapper.toDto(new ArrayList<>(result));
    }

    public List<ProcessCollectionDTO> getChildrenCollectionsByParent(UUID parentId, User user) {
        boolean hasUserAccessEveryCollection = user.getFeatureKeys().contains(FeatureKeyConstants.PROCESS_COLLECTION_ALL_ACCESS);

        if (hasUserAccessEveryCollection) {
            return processCollectionMapper.toDto(
                processCollectionRepository.findAllChildrenCollections(
                    parentId
                )
            );
        }

        Set<ProcessCollection> result =processCollectionRepository.findAvailableChildrenCollections(parentId, user);
        return processCollectionMapper.toDto(new ArrayList<>(result));
    }

    public List<ProcessCollectionDTO> getCollectionAllAncestors(
        UUID collectionId, User user
    ) throws ResponseStatusException {
        boolean hasUserAccessEveryCollection = user.getFeatureKeys().contains(FeatureKeyConstants.PROCESS_COLLECTION_ALL_ACCESS);

        List<ProcessCollection> breadcrumbs = processCollectionRepository.findAllAncestors(collectionId);
        if (!hasUserAccessEveryCollection) {
              int accessibleCollectionsCount = processCollectionRepository.countAvailableCollectionsByIds(
                  breadcrumbs.stream().map(ProcessCollection::getId).collect(Collectors.toList()),
                  user
              );

              if (accessibleCollectionsCount != breadcrumbs.size()) {
                  throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to process collection");
              }
        }

        return processCollectionMapper.toDto(breadcrumbs);
    }

    @Override
    public void delete(UUID id, User user) {
        boolean hasUserAccessEveryCollection = user.getFeatureKeys().contains(FeatureKeyConstants.PROCESS_COLLECTION_ALL_ACCESS);
        boolean hasCollectionAccess = hasUserAccessEveryCollection || processCollectionRepository.findUserAccessibleById(user, id).size() > 0;

        if (!hasCollectionAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to process collection");
        }

        processCollectionRepository.deleteById(id);
    }

    @Override
    public ProcessCollectionDTO save(ProcessCollectionDTO processCollectionDTO) {
        log.debug("Request to save ProcessCollectionDTO : {}", processCollectionDTO);
        ProcessCollection processCollection = processCollectionMapper.toEntity(processCollectionDTO);
        processCollection.setCreatedBy(userService.getUserWithAuthorities().get());
        processCollection.setUsers(
            processCollection
                .getUsers()
                .stream()
                .map(User::getLogin)
                .map(user -> userService.getUserWithAuthoritiesByLogin(user).get())
                .collect(Collectors.toSet())
        );
        processCollection = processCollectionRepository.save(processCollection);
        return processCollectionMapper.toDto(processCollection);
    }

    @Override
    public List<ProcessCollectionDTO> getUserAccessible(User user) {
        User currentUser = userService.getUserWithAuthorities().get();

        List<ProcessCollection> userAccessible = processCollectionRepository.findAllUserAccessible(currentUser);
        log.debug("userAccessible: {}", userAccessible);
        return processCollectionMapper.toDto(userAccessible);
    }
}
