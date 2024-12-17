package com.runbotics.service;

import com.runbotics.domain.GlobalVariable;

import java.util.List;

/**
 * Service Interface for managing {@link com.runbotics.domain.GlobalVariable}.
 */
public interface GlobalVariableService {
    /**
     * Get GlobalVariable set of entities.
     *
     * @param globalVariableIds the ids of the entities.
     */
    List<GlobalVariable> findByIds(List<Long> globalVariableIds);
}
