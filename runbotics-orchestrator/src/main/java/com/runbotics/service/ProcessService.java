package com.runbotics.service;

import com.runbotics.domain.User;
import com.runbotics.service.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
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

    Optional<ProcessDTO> updateOutputType(ProcessOutputTypeUpdateDTO processDTO);

    Optional<ProcessDTO> updateGlobalVariables(Long processId, List<String> globalVariableIds);

    List<ProcessDTO> findUserProcesses(User user);


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
    boolean hasRequesterCreateProcessAccess();

    /**
     * Delete the "id" process.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
    /**
     * Delete ProcessInstances with null values in process_id column (what should been set during deleting process).
     *
     */
    void deleteProcessLeftovers();

    void deleteUnassignedPrivateProcesses();
}
