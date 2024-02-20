package com.runbotics.service;

import com.runbotics.service.criteria.ProcessCollectionCriteria;
import com.runbotics.service.dto.ProcessCollectionDTO;

import java.util.List;
import java.util.UUID;

public interface ProcessCollectionService {

    List<ProcessCollectionDTO> getCollectionsByCriteria(ProcessCollectionCriteria criteria);

    List<ProcessCollectionDTO> getCollectionAllAncestors(UUID collectionId);

    ProcessCollectionDTO save(ProcessCollectionDTO ProcessCollectionDTO);
}
