package com.runbotics.service.impl;

import com.runbotics.domain.ProcessInstance;
import com.runbotics.repository.ProcessInstanceEventRepository;
import javax.persistence.PreRemove;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
public class ProcessInstanceEntityListener {

    private static ProcessInstanceEventRepository processInstanceEventRepository;

    @Autowired
    public void setProcessInstanceEventRepository(ProcessInstanceEventRepository processInstanceEventRepository) {
        ProcessInstanceEntityListener.processInstanceEventRepository = processInstanceEventRepository;
    }

    public ProcessInstanceEntityListener() {}

    @PreRemove
    void preRemove(ProcessInstance processInstance) {
        processInstanceEventRepository.deleteByProcessInstanceId(processInstance.getId());
    }
}
