package com.runbotics.service;

import com.runbotics.domain.BotCollection;
import com.runbotics.domain.User;
import com.runbotics.service.criteria.BotCollectionCriteria;
import com.runbotics.service.dto.BotCollectionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BotCollectionService {
    BotCollectionDTO save(BotCollectionDTO botCollectionDTO);

    Optional<BotCollectionDTO> partialUpdate(BotCollectionDTO botCollectionDTO);

    BotCollection getPublicCollection();

    BotCollection getGuestCollection();

    List<BotCollectionDTO> findAll();

    Page<BotCollectionDTO> findAll(Pageable pageable);

    Optional<BotCollectionDTO> findOne(UUID id);

    void delete(UUID id);

    List<BotCollectionDTO> getAllForUser(User user);

    Page<BotCollectionDTO> getPageForUser(BotCollectionCriteria criteria, Pageable pageable, User user);
}
