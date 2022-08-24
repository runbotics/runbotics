package com.runbotics.service;

import com.runbotics.service.dto.ProcessInstanceDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

/**
 * Service Interface for managing {@link com.runbotics.domain.ProcessInstance}.
 */
public interface ProcessInstanceService {
    /**
     * Save a processInstance.
     *
     * @param processInstanceDTO the entity to save.
     * @return the persisted entity.
     */
    ProcessInstanceDTO save(ProcessInstanceDTO processInstanceDTO);

    /**
     * Partially updates a processInstance.
     *
     * @param processInstanceDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProcessInstanceDTO> partialUpdate(ProcessInstanceDTO processInstanceDTO);

    /**
     * Get all the processInstances.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProcessInstanceDTO> findAll(Pageable pageable);

    /**
     * Get the "id" processInstance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProcessInstanceDTO> findOne(UUID id);

    /**
     * Delete the "id" processInstance.
     *
     * @param id the id of the entity.
     */
    void delete(UUID id);
}
