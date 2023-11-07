package com.runbotics.service;

import com.runbotics.domain.UserProcess;
import com.runbotics.service.dto.UserProcessDTO;

public interface UserProcessService {
    /**
     * Creates subscription for process notifications
     *
     * @param userProcessDTO
     */
    UserProcessDTO save(UserProcessDTO userProcessDTO);

    /**
     * Removes subscription for process notifications
     *
     * @param userProcess
     */
    void delete(UserProcess userProcess);
}
