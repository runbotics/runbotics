package com.runbotics.service.impl;

import com.runbotics.domain.*;
import com.runbotics.domain.Process;
import com.runbotics.repository.ProcessInstanceRepository;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.service.BotCollectionService;
import com.runbotics.service.ProcessService;
import com.runbotics.service.TagService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.ProcessAttendedUpdateDTO;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.dto.ProcessDiagramUpdateDTO;
import com.runbotics.service.dto.ProcessTriggerUpdateDTO;
import com.runbotics.service.exception.ProcessAccessDenied;
import com.runbotics.service.mapper.ProcessMapper;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
    private static final String ENTITY_NAME = "process";
    private final ProcessRepository processRepository;
    private final ProcessInstanceRepository processInstanceRepository;
    private final ProcessMapper processMapper;
    private final TagService tagService;
    private final UserService userService;
    private final BotCollectionService botCollectionService;

    public ProcessServiceImpl(
        ProcessRepository processRepository,
        ProcessInstanceRepository processInstanceRepository,
        ProcessMapper processMapper,
        TagService tagService,
        UserService userService,
        BotCollectionService botCollectionService
    ) {
        this.processRepository = processRepository;
        this.processInstanceRepository = processInstanceRepository;
        this.processMapper = processMapper;
        this.tagService = tagService;
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
            process.setEditor(user);
        }
        if (process.getBotCollection() == null) {
            process.setBotCollection(botCollectionService.getPublicCollection());
        }
        if (process.getSystem() == null) {
            BotSystem any = new BotSystem(BotSystem.BotSystemName.ANY.value());
            process.setSystem(any);
        }

        if (process.getTags() != null) {
            if (process.getTags().size() > 15) {
                throw new BadRequestAlertException("Tag limit of 15 exceeded", ENTITY_NAME, "tooManyTags");
            }

            Set<Tag> tags = tagService.filterTags(processDTO.getTags());
            process.setTags(tags);
        }

        if (processDTO.getId() != null) {
            List<Long> remainingTags = tagService.checkTagsToDelete(processDTO);
            process = processRepository.save(process);
            tagService.deleteUnusedTags(remainingTags);
        } else {
            process = processRepository.save(process);
        }
        return processMapper.toDto(process);
    }

    @Override
    public ProcessDTO createGuestProcess() {
        ProcessDTO processDTO = new ProcessDTO();
        processDTO.setDefinition(ProcessConstants.emptyProcessDefinition);
        processDTO.setName("Demo");
        processDTO.setIsPublic(false);
        BotSystem linuxSystem = new BotSystem(BotSystem.BotSystemName.LINUX.value());
        processDTO.setSystem(linuxSystem);
        processDTO.setBotCollection(botCollectionService.getGuestCollection());
        return save(processDTO);
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
                    existingProcess.setUpdated(ZonedDateTime.now());
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateDiagram(ProcessDiagramUpdateDTO processDiagramDTO) {
        User requester = userService.getUserWithAuthorities().get();
        return processRepository
            .findById(processDiagramDTO.getId())
            .map(
                existingProcess -> {
                    existingProcess.setDefinition(processDiagramDTO.getDefinition());
                    existingProcess.setUpdated(ZonedDateTime.now());
                    existingProcess.setEditor(requester);
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateIsAttended(ProcessAttendedUpdateDTO processAttendedDTO) {
        return processRepository
            .findById(processAttendedDTO.getId())
            .map(
                existingProcess -> {
                    existingProcess.setIsAttended(processAttendedDTO.getIsAttended());
                    existingProcess.setUpdated(ZonedDateTime.now());
                    return existingProcess;
                }
            )
            .map(processRepository::save)
            .map(processMapper::toDto);
    }

    @Override
    public Optional<ProcessDTO> updateIsTriggerable(ProcessTriggerUpdateDTO processTriggerDTO) {
        return processRepository
            .findById(processTriggerDTO.getId())
            .map(
                existingProcess -> {
                    existingProcess.setIsTriggerable(processTriggerDTO.getIsTriggerable());
                    existingProcess.setUpdated(ZonedDateTime.now());
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
                    existingProcess.setUpdated(ZonedDateTime.now());
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
                    existingProcess.setUpdated(ZonedDateTime.now());
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
        var requester = this.userService.getUserWithAuthorities().get();
        var processOptional = processRepository.findById(id).map(processMapper::toDto);

        var hasRequesterRoleAdmin = requester.getAuthorities().contains(this.createAdminAuthority());
        if (processOptional.isEmpty() || hasRequesterRoleAdmin) {
            return processOptional;
        }

        var process = processOptional.get();
        var isGuest = requester.getAuthorities().contains(createGuestAuthority());
        var isCreator = Objects.equals(process.getCreatedBy().getId(), requester.getId());
        var isPublic = process.getIsPublic();

        if (!isCreator && (!isPublic || isGuest)) {
            log.error("User {} have no access to process {}", requester.getId(), process.getId());
            throw new ProcessAccessDenied();
        }

        return processOptional;
    }

    @Override
    public List<ProcessDTO> findUserProcesses(User user) {
        return this.processRepository.findAllByCreatedBy(user).stream().map(processMapper::toDto).collect(Collectors.toList());
    }

    public boolean hasRequesterCreateProcessAccess() {
        log.debug("Request to check if current user can create process");
        var currentUser = this.userService.getUserWithAuthorities().get();
        var isGuest = currentUser.getAuthorities().contains(createGuestAuthority());
        List<Process> userProcesses = processRepository.findByCreatedByUser(currentUser.getLogin(), currentUser.getLogin());
        return !isGuest || userProcesses.size() == 0;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Process : {}", id);
        Optional<Process> process = processRepository.findById(id);
        if (process.isEmpty()) {
            throw new BadRequestAlertException("Cannot find process with this id", ENTITY_NAME, "processNotFound");
        }

        List<Long> remainingTags = process.get().getTags().stream().map(Tag::getId).collect(Collectors.toList());
        processRepository.deleteById(id);
        tagService.deleteUnusedTags(remainingTags);
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

    private Authority createAdminAuthority() {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        return adminAuthority;
    }

    private Authority createGuestAuthority() {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.GUEST);
        return adminAuthority;
    }
}
