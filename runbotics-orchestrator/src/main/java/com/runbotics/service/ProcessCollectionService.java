package com.runbotics.service;

import com.runbotics.domain.BotCollection;
import com.runbotics.domain.User;
import com.runbotics.service.criteria.BotCollectionCriteria;
import com.runbotics.service.criteria.ProcessCollectionCriteria;
import com.runbotics.service.dto.ProcessCollectionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProcessCollectionService {
    ProcessCollectionDTO save(ProcessCollectionDTO ProcessCollectionDTO);
}
