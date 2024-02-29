package com.runbotics.service;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.User;
import com.runbotics.domain.User;
import com.runbotics.service.dto.ProcessCollectionDTO;
import java.util.List;
import java.util.UUID;

public interface ProcessCollectionService {
    void checkCollectionAvailability(UUID collectionId, User user);
    List<ProcessCollectionDTO> getChildrenCollectionsByRoot(User user);

    List<ProcessCollectionDTO> getChildrenCollectionsByParent(UUID parentId, User user);

    List<ProcessCollectionDTO> getCollectionAllAncestors(UUID collectionId, User user);

    ProcessCollectionDTO save(ProcessCollectionDTO ProcessCollectionDTO);

    List<ProcessCollectionDTO> getUserAccessible(User user);

    void delete(UUID collectionId, User user);
}
