package com.runbotics.service;

import com.runbotics.service.dto.GlobalVariableDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
}
