package com.runbotics.service.impl;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.repository.GlobalVariableRepository;
import com.runbotics.service.GlobalVariableService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link GlobalVariable}.
 */
@Service
@Transactional
public class GlobalVariableServiceImpl implements GlobalVariableService {

    private final Logger log = LoggerFactory.getLogger(GlobalVariableServiceImpl.class);

    private final GlobalVariableRepository globalVariableRepository;

    public GlobalVariableServiceImpl(
        GlobalVariableRepository globalVariableRepository
    ) {
        this.globalVariableRepository = globalVariableRepository;
    }

    @Override
    public List<GlobalVariable> findByIds(List<Long> globalVariableIds) {
        return globalVariableRepository.findAllById(globalVariableIds);
    }
}
