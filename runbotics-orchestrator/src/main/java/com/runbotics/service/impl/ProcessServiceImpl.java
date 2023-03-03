package com.runbotics.service.impl;

import com.runbotics.domain.BotSystem;
import com.runbotics.domain.Process;
import com.runbotics.domain.ProcessInstance;
import com.runbotics.domain.User;
import com.runbotics.repository.ProcessInstanceRepository;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.service.BotCollectionService;
import com.runbotics.service.ProcessService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.mapper.ProcessMapper;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Process}.
 */
@Service
@Transactional
public class ProcessServiceImpl implements ProcessService {

    private final Logger log = LoggerFactory.getLogger(ProcessServiceImpl.class);

    private final ProcessRepository processRepository;
    private final ProcessInstanceRepository processInstanceRepository;
    private final ProcessMapper processMapper;

    private final UserService userService;
    private final BotCollectionService botCollectionService;

    public ProcessServiceImpl(
        ProcessRepository processRepository,
        ProcessInstanceRepository processInstanceRepository,
        ProcessMapper processMapper,
        UserService userService,
        BotCollectionService botCollectionService
    ) {
        this.processRepository = processRepository;
        this.processInstanceRepository = processInstanceRepository;
        this.processMapper = processMapper;
        this.userService = userService;
        this.botCollectionService = botCollectionService;
    }

    @Override
    public ProcessDTO save(ProcessDTO processDTO) {
        log.debug("Request to save Process : {}", processDTO);
        Process process = processMapper.toEntity(processDTO);
        process.setUpdated(ZonedDateTime.now());
        if (process.getId() == null) {
            User user = userService.getUserWithAuthorities().get();
            process.setCreated(ZonedDateTime.now());
            process.setCreatedBy(user);
            process.setExecutionsCount(0L);
            process.setFailureExecutionsCount(0L);
            process.setSuccessExecutionsCount(0L);
        }
        if (process.getBotCollection() == null) {
            process.setBotCollection(botCollectionService.getPublicCollection());
        }
        if (process.getSystem() == null) {
            BotSystem any = new BotSystem(BotSystem.BotSystemName.ANY.value());
            process.setSystem(any);
        }
        process = processRepository.save(process);
        return processMapper.toDto(process);
    }

    @Override
    public Optional<ProcessDTO> partialUpdate(ProcessDTO processDTO) {
        log.info("Request to partially update Process : {}", processDTO.getBotCollection());

        return processRepository
            .findById(processDTO.getId())
            .map(
                existingProcess -> {
                    updateBotCollectionRelationsInDto(processDTO, existingProcess);
                    processMapper.partialUpdate(existingProcess, processDTO);
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateIsAttended(ProcessDTO processDTO) {
        return processRepository
            .findById(processDTO.getId())
            .map(
                existingProcess -> {
                    processMapper.partialUpdate(existingProcess, processDTO);
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateIsTriggerable(ProcessDTO processDTO) {
        return processRepository
            .findById(processDTO.getId())
            .map(
                existingProcess -> {
                    processMapper.partialUpdate(existingProcess, processDTO);
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateBotCollection(ProcessDTO processDTO) {
        return processRepository
            .findById(processDTO.getId())
            .map(
                existingProcess -> {
                    updateBotCollectionRelationsInDto(processDTO, existingProcess);
                    existingProcess.setBotCollection(processDTO.getBotCollection());
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateBotSystem(ProcessDTO processDTO) {
        log.info("Request to set bot system for the Process to: {}", processDTO.getSystem());

        return processRepository
            .findById(processDTO.getId())
            .map(
                existingProcess -> {
                    updateBotCollectionRelationsInDto(processDTO, existingProcess);
                    existingProcess.setSystem(processDTO.getSystem());
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProcessDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Processes");
        return processRepository.findAll(pageable).map(processMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProcessDTO> findOne(Long id) {
        log.debug("Request to get Process : {}", id);
        return processRepository.findById(id).map(processMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProcessDTO> findByName(String name) {
        log.debug("Request to get Process : {}", name);
        return processRepository.findByName(name).map(processMapper::toDto);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Process : {}", id);
        processRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteUnassignedPrivateProcesses() {
        log.debug("Request to delete unassigned private Processes");
        processRepository.deleteUnassignedPrivateProcesses();
    }

    private void updateBotCollectionRelationsInDto(ProcessDTO processDTO, Process existingProcess) {
        if (processDTO.getBotCollection() != null && existingProcess.getBotCollection() != null) {
            if (existsRelationsToUpdate(existingProcess.getBotCollection().getBots())) {
                processDTO.getBotCollection().setBots(existingProcess.getBotCollection().getBots());
            }
            if (existsRelationsToUpdate(existingProcess.getBotCollection().getUsers())) {
                processDTO.getBotCollection().setUsers(existingProcess.getBotCollection().getUsers());
            }
        }
    }

    private boolean existsRelationsToUpdate(Set relation) {
        return relation != null && relation.isEmpty();
    }
}
