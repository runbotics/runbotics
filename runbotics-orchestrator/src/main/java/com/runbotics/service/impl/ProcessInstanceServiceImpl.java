package com.runbotics.service.impl;

import com.runbotics.domain.Authority;
import com.runbotics.domain.ProcessInstance;
import com.runbotics.repository.ProcessInstanceRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.service.ProcessInstanceService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.dto.ProcessInstanceDTO;
import com.runbotics.service.exception.ProcessInstanceAccessDenied;
import com.runbotics.service.mapper.ProcessInstanceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * Service Implementation for managing {@link ProcessInstance}.
 */
@Service
@Transactional
public class ProcessInstanceServiceImpl implements ProcessInstanceService {

    private final Logger log = LoggerFactory.getLogger(ProcessInstanceServiceImpl.class);

    private final ProcessInstanceRepository processInstanceRepository;
    private final ProcessInstanceMapper processInstanceMapper;

    private final UserService userService;

    public ProcessInstanceServiceImpl(
        ProcessInstanceRepository processInstanceRepository,
        ProcessInstanceMapper processInstanceMapper,
        UserService userService
    ) {
        this.processInstanceRepository = processInstanceRepository;
        this.processInstanceMapper = processInstanceMapper;
        this.userService = userService;
    }

    @Override
    public ProcessInstanceDTO save(ProcessInstanceDTO processInstanceDTO) {
        log.debug("Request to save ProcessInstance : {}", processInstanceDTO);
        ProcessInstance processInstance = processInstanceMapper.toEntity(processInstanceDTO);
        processInstance = processInstanceRepository.saveAndFlush(processInstance);
        return processInstanceMapper.toDto(processInstance);
    }

    @Override
    public Optional<ProcessInstanceDTO> partialUpdate(ProcessInstanceDTO processInstanceDTO) {
        log.debug("Request to partially update ProcessInstance : {}", processInstanceDTO);

        return processInstanceRepository
            .findById(processInstanceDTO.getId())
            .map(
                existingProcessInstance -> {
                    processInstanceMapper.partialUpdate(existingProcessInstance, processInstanceDTO);
                    return existingProcessInstance;
                }
            )
            .map(processInstanceRepository::save)
            .map(processInstanceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProcessInstanceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ProcessInstances");
        return processInstanceRepository.findAll(pageable).map(processInstanceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProcessInstanceDTO> findOne(UUID id) {
        log.debug("Request to get ProcessInstance : {}", id);
        Optional<ProcessInstance> optionalProcessInstance = processInstanceRepository.findById(id);

        if (optionalProcessInstance.isEmpty()) {
            return Optional.empty();
        }

        var requester = userService.getUserWithAuthorities().orElseThrow(ProcessInstanceAccessDenied::new);

        var processInstance = optionalProcessInstance.get();
        var isProcessPublic = processInstance.getProcess().getIsPublic();
        var adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        var isAdmin = requester.getAuthorities().contains(adminAuthority);
        var isCreator = Objects.equals(processInstance.getProcess().getCreatedBy(), requester);

        if (!(isProcessPublic || isAdmin || isCreator)) {
            throw new ProcessInstanceAccessDenied();
        }

        return optionalProcessInstance.map(processInstanceMapper::toDto);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Request to delete ProcessInstance : {}", id);
        processInstanceRepository.deleteById(id);
    }

    @Override
    public Page<ProcessInstanceDTO> findSubprocesses(UUID processInstanceId, Pageable pageable) {
        Page<ProcessInstance> subprocesses = processInstanceRepository.findByParentId(processInstanceId, pageable);
        Page<ProcessInstanceDTO> subprocessesMapped = subprocesses.map(processInstanceMapper::toDto);

        subprocessesMapped.forEach(dto -> {
            dto.setBot(null);
            ProcessDTO process = dto.getProcess();
            if (process != null) {
                process.setBotCollection(null);
            }
        });

        return subprocessesMapped;
    }
}
