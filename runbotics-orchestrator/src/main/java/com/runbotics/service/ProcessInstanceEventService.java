package com.runbotics.service;

import com.runbotics.service.dto.ProcessInstanceEventDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.runbotics.domain.ProcessInstanceEvent}.
 */
public interface ProcessInstanceEventService {
    /**
     * Save a processInstanceEvent.
     *
     * @param processInstanceEventDTO the entity to save.
     * @return the persisted entity.
     */
    ProcessInstanceEventDTO save(ProcessInstanceEventDTO processInstanceEventDTO);

    /**
     * Partially updates a processInstanceEvent.
     *
     * @param processInstanceEventDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProcessInstanceEventDTO> partialUpdate(ProcessInstanceEventDTO processInstanceEventDTO);

    /**
     * Get all the processInstanceEvents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProcessInstanceEventDTO> findAll(Pageable pageable);

    /**
     * Get the "id" processInstanceEvent.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProcessInstanceEventDTO> findOne(Long id);

    /**
     * Delete the "id" processInstanceEvent.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
