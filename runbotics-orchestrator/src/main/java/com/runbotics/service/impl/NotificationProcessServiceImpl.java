package com.runbotics.service.impl;

import com.runbotics.domain.*;
import com.runbotics.domain.Process;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.repository.NotificationProcessRepository;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.NotificationProcessService;
import com.runbotics.service.dto.NotificationProcessDTO;
import com.runbotics.service.exception.ProcessNotFoundException;
import com.runbotics.service.mapper.NotificationProcessMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationProcessServiceImpl implements NotificationProcessService {

    private final Logger log = LoggerFactory.getLogger(NotificationProcessServiceImpl.class);
    private static final String ENTITY_NAME = "notification_process";
    private final NotificationProcessRepository notificationProcessRepository;
    private final UserRepository userRepository;
    private final ProcessRepository processRepository;
    private final NotificationProcessMapper notificationProcessMapper;

    public NotificationProcessServiceImpl(NotificationProcessRepository notificationProcessRepository, UserRepository userRepository, ProcessRepository processRepository, NotificationProcessMapper notificationProcessMapper) {
        this.notificationProcessRepository = notificationProcessRepository;
        this.userRepository = userRepository;
        this.processRepository = processRepository;
        this.notificationProcessMapper = notificationProcessMapper;
    }

    @Override
    public NotificationProcessDTO save(NotificationProcessDTO notificationProcessDTO) {
        log.debug("Request to save process subscription: {}", notificationProcessDTO);

        Long userId = notificationProcessDTO.getUser().getId();
        Long processId = notificationProcessDTO.getProcess().getId();

        User user = userRepository.findById(userId).orElseThrow(
            () -> new UsernameNotFoundException("Could not found user with id " + userId + " in the database")
        );
        Process process = processRepository.findById(processId).orElseThrow(
            () -> new ProcessNotFoundException(processId)
        );

        NotificationProcess notificationProcess = notificationProcessMapper.toEntity(notificationProcessDTO);

        NotificationType notificationType = new NotificationType(NotificationType.NotificationTypeName.PROCESS.value());
        notificationProcess.setType(notificationType);

        notificationProcess.setCreatedAt(ZonedDateTime.now());
        notificationProcess.setUser(user);
        notificationProcess.setProcess(process);

        NotificationProcess userProcessRepositoryResponse = notificationProcessRepository.save(notificationProcess);

        return notificationProcessMapper.toDto(userProcessRepositoryResponse);
    }

    @Override
    public List<NotificationProcessDTO> getAllSubscriptionsByProcessId(Long processId) {
        log.debug("Request to get all process subscriptions by processId: {}", processId);

        return notificationProcessRepository
            .findAllByProcessId(processId)
            .stream()
            .map(notificationProcessMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<NotificationProcessDTO> getSubscriptionByProcessIdAndUserId(Long processId, Long userId) {
        log.debug("Request to get process subscription by processId and userId: {} {}", processId, userId);

        return notificationProcessRepository
            .findOneByProcessIdAndUserId(processId, userId)
            .map(notificationProcessMapper::toDto);
    }

    @Override
    public void delete(NotificationProcess notificationProcess) {
        log.debug("Request to delete process subscription: {}", notificationProcess);

        notificationProcessRepository.delete(notificationProcess);
    }
}
