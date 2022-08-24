package com.runbotics.service;

import com.runbotics.service.dto.ScheduleProcessDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.runbotics.domain.ScheduleProcess}.
 */
public interface ScheduleProcessService {
    /**
     * Get all the scheduleProcesses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ScheduleProcessDTO> findAll(Pageable pageable);

    /**
     * Get the "id" scheduleProcess.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ScheduleProcessDTO> findOne(Long id);
}
