package com.runbotics.service.impl;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;
import com.runbotics.domain.UserProcess;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.repository.UserProcessRepository;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.UserProcessService;
import com.runbotics.service.dto.UserProcessDTO;
import com.runbotics.service.mapper.UserProcessMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserProcessServiceImpl implements UserProcessService {

    private final Logger log = LoggerFactory.getLogger(UserProcessServiceImpl.class);
    private static final String ENTITY_NAME = "jhi_user_process";
    private final UserProcessRepository userProcessRepository;
    private final UserRepository userRepository;
    private final ProcessRepository processRepository;
    private final UserProcessMapper userProcessMapper;

    public UserProcessServiceImpl(UserProcessRepository userProcessRepository, UserRepository userRepository, ProcessRepository processRepository, UserProcessMapper userProcessMapper) {
        this.userProcessRepository = userProcessRepository;
        this.userRepository = userRepository;
        this.processRepository = processRepository;
        this.userProcessMapper = userProcessMapper;
    }

    @Override
    public UserProcessDTO save(UserProcessDTO userProcessDTO) {
        log.debug("Request to save process subscription: {}", userProcessDTO);

        User user = userRepository.findById(userProcessDTO.getUserId()).orElseThrow();
        Process process = processRepository.findById(userProcessDTO.getProcessId()).orElseThrow();

        UserProcess userProcess = userProcessMapper.toEntity(userProcessDTO);
        userProcess.setSubscribedAt(ZonedDateTime.now());
        userProcess.setUser(user);
        userProcess.setProcess(process);

        UserProcess userProcessRepositoryResponse = userProcessRepository.save(userProcess);

        return userProcessMapper.toDto(userProcessRepositoryResponse);
    }

    @Override
    public List<UserProcessDTO> getAllSubscriptionsByProcessId(Long processId) {
        log.debug("Request to get all process subscriptions by processId: {}", processId);

        return userProcessRepository
            .findAllWhereIdProcessId(processId)
            .stream()
            .map(userProcessMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public void delete(UserProcess userProcess) {
        log.debug("Request to delete process subscription: {}", userProcess);

        userProcessRepository.deleteByIdUserIdAndIdProcessId(
            userProcess.getUser().getId(),
            userProcess.getProcess().getId()
        );
    }
}
