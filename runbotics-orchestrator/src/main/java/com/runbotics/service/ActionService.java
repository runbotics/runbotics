package com.runbotics.service;

import com.runbotics.service.dto.ActionDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.runbotics.domain.Action}.
 */
public interface ActionService {
    /**
     * Save a action.
     *
     * @param actionDTO the entity to save.
     * @return the persisted entity.
     */
    ActionDTO save(ActionDTO actionDTO);

    /**
     * Partially updates a action.
     *
     * @param actionDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ActionDTO> partialUpdate(ActionDTO actionDTO);

    /**
     * Get all the actions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ActionDTO> findAll(Pageable pageable);

    /**
     * Get the "id" action.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ActionDTO> findOne(String id);

    /**
     * Delete the "id" action.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
