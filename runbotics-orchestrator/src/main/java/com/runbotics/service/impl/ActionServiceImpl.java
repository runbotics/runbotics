package com.runbotics.service.impl;

import com.runbotics.domain.Action;
import com.runbotics.repository.ActionRepository;
import com.runbotics.service.ActionService;
import com.runbotics.service.dto.ActionDTO;
import com.runbotics.service.mapper.ActionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Action}.
 */
@Service
@Transactional
public class ActionServiceImpl implements ActionService {

    private final Logger log = LoggerFactory.getLogger(ActionServiceImpl.class);

    private final ActionRepository actionRepository;

    private final ActionMapper actionMapper;

    public ActionServiceImpl(ActionRepository actionRepository, ActionMapper actionMapper) {
        this.actionRepository = actionRepository;
        this.actionMapper = actionMapper;
    }

    @Override
    public ActionDTO save(ActionDTO actionDTO) {
        log.debug("Request to save Action : {}", actionDTO);
        Action action = actionMapper.toEntity(actionDTO);
        action = actionRepository.save(action);
        return actionMapper.toDto(action);
    }

    @Override
    public Optional<ActionDTO> partialUpdate(ActionDTO actionDTO) {
        log.debug("Request to partially update Action : {}", actionDTO);

        return actionRepository
            .findById(actionDTO.getId())
            .map(
                existingAction -> {
                    actionMapper.partialUpdate(existingAction, actionDTO);
                    return existingAction;
                }
            )
            .map(actionRepository::save)
            .map(actionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ActionDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Actions");
        return actionRepository.findAll(pageable).map(actionMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ActionDTO> findOne(String id) {
        log.debug("Request to get Action : {}", id);
        return actionRepository.findById(id).map(actionMapper::toDto);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Action : {}", id);
        actionRepository.deleteById(id);
    }
}
