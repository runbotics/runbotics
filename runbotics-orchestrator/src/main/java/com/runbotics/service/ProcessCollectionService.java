package com.runbotics.service;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.User;
import com.runbotics.service.criteria.ProcessCollectionCriteria;
import com.runbotics.service.dto.ProcessCollectionDTO;

import java.util.List;

public interface ProcessCollectionService {

    List<ProcessCollectionDTO> getCollectionsByCriteria(ProcessCollectionCriteria criteria);

    ProcessCollectionDTO save(ProcessCollectionDTO ProcessCollectionDTO);
    List<ProcessCollectionDTO> getUserAccessible(User user);
}
