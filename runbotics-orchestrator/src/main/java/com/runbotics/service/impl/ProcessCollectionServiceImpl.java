package com.runbotics.service.impl;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.User;
import com.runbotics.repository.ProcessCollectionRepository;
import com.runbotics.service.ProcessCollectionService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.ProcessCollectionCriteria;
import com.runbotics.service.dto.ProcessCollectionDTO;
import com.runbotics.service.ProcessCollectionQueryService;
import com.runbotics.service.mapper.ProcessCollectionMapper;
import org.hibernate.Criteria;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    public List<ProcessCollectionDTO> getCollectionsByCriteria(ProcessCollectionCriteria criteria) { // todo: replace this with ProcessCollectionQuery.findByCriteria()
        if (criteria.getParentId() != null) {
            return processCollectionMapper.toDto(
                    processCollectionRepository.findAllChildrenCollections(
                        criteria.getParentId().getEquals()
                    ));
        }

        return processCollectionMapper.toDto(
            processCollectionRepository.findAllRootCollections()
        );
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
