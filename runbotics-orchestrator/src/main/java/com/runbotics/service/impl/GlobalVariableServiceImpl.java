package com.runbotics.service.impl;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.domain.Process;
import com.runbotics.repository.GlobalVariableRepository;
import com.runbotics.service.GlobalVariableService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.GlobalVariableDTO;
import com.runbotics.service.mapper.GlobalVariableMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link GlobalVariable}.
 */
@Service
@Transactional
public class GlobalVariableServiceImpl implements GlobalVariableService {

    private final Logger log = LoggerFactory.getLogger(GlobalVariableServiceImpl.class);

    private final GlobalVariableRepository globalVariableRepository;

    private final GlobalVariableMapper globalVariableMapper;

    private final UserService userService;

    public GlobalVariableServiceImpl(
        GlobalVariableRepository globalVariableRepository,
        GlobalVariableMapper globalVariableMapper,
        UserService userService
    ) {
        this.globalVariableRepository = globalVariableRepository;
        this.globalVariableMapper = globalVariableMapper;
        this.userService = userService;
    }

    @Override
    public GlobalVariableDTO save(GlobalVariableDTO globalVariableDTO) {
        log.debug("Request to save GlobalVariable : {}", globalVariableDTO);
        GlobalVariable globalVariable = globalVariableMapper.toEntity(globalVariableDTO);
        globalVariable.setLastModified(ZonedDateTime.now());
        var user = userService.getUserWithAuthorities().get();
        if ( globalVariableDTO.getId() == null ) globalVariable.setCreator(user);
        globalVariable.setUser(user);
        globalVariable = globalVariableRepository.save(globalVariable);
        return globalVariableMapper.toDto(globalVariable);
    }

    @Override
    public Optional<GlobalVariableDTO> partialUpdate(GlobalVariableDTO globalVariableDTO) {
        log.debug("Request to partially update GlobalVariable : {}", globalVariableDTO);

        return globalVariableRepository
            .findById(globalVariableDTO.getId())
            .map(
                existingGlobalVariable -> {
                    globalVariableMapper.partialUpdate(existingGlobalVariable, globalVariableDTO);
                    return existingGlobalVariable;
                }
            )
            .map(globalVariableRepository::save)
            .map(globalVariableMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GlobalVariableDTO> findAll(Pageable pageable) {
        log.debug("Request to get all GlobalVariables");
        return globalVariableRepository.findAll(pageable).map(globalVariableMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GlobalVariableDTO> findOne(Long id) {
        log.debug("Request to get GlobalVariable : {}", id);
        return globalVariableRepository.findById(id).map(globalVariableMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete GlobalVariable : {}", id);
        globalVariableRepository.deleteById(id);
    }

    @Override
    public List<String> getProcessNamesAssociatedWithGlobalVariable(Long id) {
        return globalVariableRepository.getAssociatedProcesses(id).stream()
            .map(Process::getName)
            .collect(Collectors.toList());
    }

    @Override
    public List<GlobalVariable> findByIds(List<Long> globalVariableIds) {
        return globalVariableRepository.findAllById(globalVariableIds);
    }
}
