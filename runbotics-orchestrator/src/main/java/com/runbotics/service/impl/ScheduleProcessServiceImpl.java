package com.runbotics.service.impl;

import com.runbotics.domain.ScheduleProcess;
import com.runbotics.repository.ScheduleProcessRepository;
import com.runbotics.service.ScheduleProcessService;
import com.runbotics.service.dto.ScheduleProcessDTO;
import com.runbotics.service.mapper.ScheduleProcessMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link ScheduleProcess}.
 */
@Service
@Transactional
public class ScheduleProcessServiceImpl implements ScheduleProcessService {

    private final Logger log = LoggerFactory.getLogger(ScheduleProcessServiceImpl.class);

    private final ScheduleProcessRepository scheduleProcessRepository;
    private final ScheduleProcessMapper scheduleProcessMapper;

    public ScheduleProcessServiceImpl(
        ScheduleProcessRepository scheduleProcessRepository,
        ScheduleProcessMapper scheduleProcessMapper
    ) {
        this.scheduleProcessRepository = scheduleProcessRepository;
        this.scheduleProcessMapper = scheduleProcessMapper;
    }

    /**
     * Get all the scheduleProcesses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ScheduleProcessDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ScheduleProcesses");
        return scheduleProcessRepository.findAll(pageable).map(scheduleProcessMapper::toDto);
    }

    /**
     * Get one scheduleProcess by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<ScheduleProcessDTO> findOne(Long id) {
        log.debug("Request to get ScheduleProcess : {}", id);
        return scheduleProcessRepository.findById(id).map(scheduleProcessMapper::toDto);
    }
}
