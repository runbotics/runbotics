package com.runbotics.service;

import com.runbotics.domain.NotificationProcess;
import com.runbotics.service.dto.NotificationProcessDTO;

import java.util.List;

public interface NotificationProcessService {
    /**
     * Creates subscription for process notifications
     *
     * @param notificationProcessDTO
     */
    NotificationProcessDTO save(NotificationProcessDTO notificationProcessDTO);

    /**
     * Gets all subscription for process notifications
     *
     * @param processId
     */
    List<NotificationProcessDTO> getAllSubscriptionsByProcessId(Long processId);


    /**
     * Removes subscription for process notifications
     *
     * @param notificationProcess
     */
    void delete(NotificationProcess notificationProcess);
}
