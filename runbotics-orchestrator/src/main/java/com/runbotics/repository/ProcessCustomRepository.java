package com.runbotics.repository;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;
import com.runbotics.service.criteria.ProcessCriteria;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProcessCustomRepository {
    Page<Process> findBySearch(String name, String createdByName, String tagName, User user, Pageable pageable);

    Page<Process> findBySearchAndCollection(
        String name,
        String createdByName,
        String tagName,
        UUID collectionId,
        User user,
        Pageable pageable
    );
}
