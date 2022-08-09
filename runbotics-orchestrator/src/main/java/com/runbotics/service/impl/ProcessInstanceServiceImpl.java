package com.runbotics.service.impl;

import com.runbotics.domain.ProcessInstance;
import com.runbotics.repository.ProcessInstanceRepository;
import com.runbotics.service.ProcessInstanceService;
import com.runbotics.service.dto.ProcessInstanceDTO;
import com.runbotics.service.exception.ProcessInstanceNotFound;
import com.runbotics.service.mapper.ProcessInstanceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public ProcessInstanceServiceImpl(
        ProcessInstanceRepository processInstanceRepository,
        ProcessInstanceMapper processInstanceMapper
    ) {
        this.processInstanceRepository = processInstanceRepository;
        this.processInstanceMapper = processInstanceMapper;
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
        return processInstanceRepository.findById(id).map(processInstanceMapper::toDto);
    }

    @Override
    public void delete(UUID id) {
        log.debug("Request to delete ProcessInstance : {}", id);
        processInstanceRepository.deleteById(id);
    }
}
