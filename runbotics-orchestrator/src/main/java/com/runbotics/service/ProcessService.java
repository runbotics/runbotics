package com.runbotics.service;

import com.runbotics.service.dto.ProcessAttendedUpdateDTO;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.dto.ProcessDiagramUpdateDTO;
import com.runbotics.service.dto.ProcessTriggerUpdateDTO;
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

    ProcessDTO createGuestProcess();

    /**
     * Partially updates a process.
     *
     * @param processDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ProcessDTO> partialUpdate(ProcessDTO processDTO);

    Optional<ProcessDTO> updateDiagram(ProcessDiagramUpdateDTO processDiagramDTO);

    Optional<ProcessDTO> updateIsAttended(ProcessAttendedUpdateDTO processAttendedDTO);

    Optional<ProcessDTO> updateIsTriggerable(ProcessTriggerUpdateDTO processTriggerDTO);

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
     * Check if user is a guest without any processes or simply is not a guest.
     *
     * @return false if is a guest with any process.
     */
    boolean getCanBeCreatedByCurrentUser();

    /**
     * Delete the "id" process.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    void deleteUnassignedPrivateProcesses();
}
