package com.runbotics.repository;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;
import com.runbotics.service.criteria.ProcessCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProcessCustomRepository {

    Page<Process> findBySearchForAdmin(String name, String createdByName, String tagName, Pageable pageable);

    Page<Process> findBySearchForUser(String name, String createdByName, String tagName, User user, Pageable pageable);

    Page<Process> findBySearchAndCollectionForAdmin(String name, String createdByName, String tagName, UUID collectionId, Pageable pageable);

    Page<Process> findBySearchAndCollectionForUser(String name, String createdByName, String tagName, UUID collectionId, User user, Pageable pageable);
}
