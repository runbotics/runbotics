package com.runbotics.service;

import com.runbotics.service.dto.ProcessDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link com.runbotics.domain.Process}.
 */
public interface ProcessService {
    /**
     * Save a process.
     *
     * @param processDTO the entity to save.
     * @return the persisted entity.
     */
    ProcessDTO save(ProcessDTO processDTO);

    /**
     * Partially updates a process.
     *
     * @param processDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProcessDTO> partialUpdate(ProcessDTO processDTO);

    Optional<ProcessDTO> updateDiagram(ProcessDTO processDTO);

    Optional<ProcessDTO> updateIsAttended(ProcessDTO processDTO);

    Optional<ProcessDTO> updateIsTriggerable(ProcessDTO processDTO);

    Optional<ProcessDTO> updateBotCollection(ProcessDTO processDTO);

    Optional<ProcessDTO> updateBotSystem(ProcessDTO processDTO);

    /**
     * Get all the processes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ProcessDTO> findAll(Pageable pageable);

    /**
     * Get the "id" process.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ProcessDTO> findOne(Long id);

    /**
     * Delete the "id" process.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    void deleteUnassignedPrivateProcesses();
}
