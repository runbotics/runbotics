package com.runbotics.service;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.service.dto.GlobalVariableDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.runbotics.domain.GlobalVariable}.
 */
public interface GlobalVariableService {
    /**
     * Save a globalVariable.
     *
     * @param globalVariableDTO the entity to save.
     * @return the persisted entity.
     */
    GlobalVariableDTO save(GlobalVariableDTO globalVariableDTO);

    /**
     * Partially updates a globalVariable.
     *
     * @param globalVariableDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<GlobalVariableDTO> partialUpdate(GlobalVariableDTO globalVariableDTO);

    /**
     * Get all the globalVariables.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<GlobalVariableDTO> findAll(Pageable pageable);

    /**
     * Get the "id" globalVariable.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<GlobalVariableDTO> findOne(Long id);

    /**
     * Delete the "id" globalVariable.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get name of processes which use this globalVariable.
     *
     * @param id the id of the entity.
     */
    List<String> getProcessNamesAssociatedWithGlobalVariable(Long id);


    /**
     * Get GlobalVariable set of entities.
     *
     * @param globalVariableIds the ids of the entities.
     */
    List<GlobalVariable> findByIds(List<Long> globalVariableIds);

    /**
    * Get page of GlobalVariables by creator id.
    *
    * @param pageable the pagination information.
    * @param id the id of the requesting user.
    */
    Page<GlobalVariableDTO> getByRequester(Pageable pageable, Long id);

}
