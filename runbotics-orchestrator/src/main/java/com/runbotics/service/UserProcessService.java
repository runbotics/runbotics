package com.runbotics.service;

import com.runbotics.domain.UserProcess;
import com.runbotics.service.dto.UserProcessDTO;

import java.util.List;

public interface UserProcessService {
    /**
     * Creates subscription for process notifications
     *
     * @param userProcessDTO
     */
    UserProcessDTO save(UserProcessDTO userProcessDTO);

    /**
     * Gets all subscription for process notifications
     *
     * @param processId
     */
    List<UserProcessDTO> getAllSubscriptionsByProcessId(Long processId);


    /**
     * Removes subscription for process notifications
     *
     * @param userProcess
     */
    void delete(UserProcess userProcess);
}
