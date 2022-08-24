package com.runbotics.service.impl;

import com.runbotics.domain.ProcessInstanceEvent;
import com.runbotics.repository.ProcessInstanceEventRepository;
import com.runbotics.service.ProcessInstanceEventService;
import com.runbotics.service.dto.ProcessInstanceEventDTO;
import com.runbotics.service.mapper.ProcessInstanceEventMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ProcessInstanceEvent}.
 */
@Service
@Transactional
public class ProcessInstanceEventServiceImpl implements ProcessInstanceEventService {

    private final Logger log = LoggerFactory.getLogger(ProcessInstanceEventServiceImpl.class);

    private final ProcessInstanceEventRepository processInstanceEventRepository;

    private final ProcessInstanceEventMapper processInstanceEventMapper;

    public ProcessInstanceEventServiceImpl(
        ProcessInstanceEventRepository processInstanceEventRepository,
        ProcessInstanceEventMapper processInstanceEventMapper
    ) {
        this.processInstanceEventRepository = processInstanceEventRepository;
        this.processInstanceEventMapper = processInstanceEventMapper;
    }

    @Override
    public ProcessInstanceEventDTO save(ProcessInstanceEventDTO processInstanceEventDTO) {
        log.debug("Request to save ProcessInstanceEvent : {}", processInstanceEventDTO);
        ProcessInstanceEvent processInstanceEvent = processInstanceEventMapper.toEntity(processInstanceEventDTO);
        processInstanceEvent = processInstanceEventRepository.save(processInstanceEvent);
        return processInstanceEventMapper.toDto(processInstanceEvent);
    }

    @Override
    public Optional<ProcessInstanceEventDTO> partialUpdate(ProcessInstanceEventDTO processInstanceEventDTO) {
        log.debug("Request to partially update ProcessInstanceEvent : {}", processInstanceEventDTO);

        return processInstanceEventRepository
            .findById(processInstanceEventDTO.getId())
            .map(
                existingProcessInstanceEvent -> {
                    processInstanceEventMapper.partialUpdate(existingProcessInstanceEvent, processInstanceEventDTO);
                    return existingProcessInstanceEvent;
                }
            )
            .map(processInstanceEventRepository::save)
            .map(processInstanceEventMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProcessInstanceEventDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ProcessInstanceEvents");
        return processInstanceEventRepository.findAll(pageable).map(processInstanceEventMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProcessInstanceEventDTO> findOne(Long id) {
        log.debug("Request to get ProcessInstanceEvent : {}", id);
        return processInstanceEventRepository.findById(id).map(processInstanceEventMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ProcessInstanceEvent : {}", id);
        processInstanceEventRepository.deleteById(id);
    }
}
