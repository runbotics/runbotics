package com.runbotics.service.impl;

import com.runbotics.domain.Tenant;
import com.runbotics.domain.User;
import com.runbotics.repository.TenantRepository;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.TenantService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.TenantDTO;
import com.runbotics.service.mapper.TenantMapper;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Tenant}.
 */
@Service
@Transactional
public class TenantServiceImpl implements TenantService {

    private static final String ENTITY_NAME = "tenant";

    private final Logger log = LoggerFactory.getLogger(TenantServiceImpl.class);

    private final TenantRepository tenantRepository;

    private final TenantMapper tenantMapper;

    private final UserService userService;

    private final UserRepository userRepository;

    public TenantServiceImpl(
        TenantRepository tenantRepository,
        TenantMapper tenantMapper,
        UserService userService,
        UserRepository userRepository
    ) {
        this.tenantRepository = tenantRepository;
        this.tenantMapper = tenantMapper;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public List<TenantDTO> getAll() {
        log.debug("Request to get all Tenants");
        return tenantRepository.findAll()
            .stream().map(tenantMapper::toDto)
            .collect(Collectors.toList());
    }

    public Optional<TenantDTO> getById(UUID id) {
        log.debug("Request to get Tenant by id: {}", id);
        return tenantRepository.findById(id).map(tenantMapper::toDto);
    }

    public Optional<TenantDTO> getByRequester() {
        User requester = userService.getUserWithAuthorities().get();
        log.debug("Request to get Tenant by requester: {}", requester);

        return tenantRepository
            .findById(requester.getTenant().getId())
            .map(tenantMapper::toDto);
    }

    public TenantDTO save(TenantDTO tenantDTO) {
        log.debug("Request to save Tenant: {}", tenantDTO);

        final User user = userService.getUserWithAuthorities().get();

        if (tenantDTO.getId() != null) {
            throw new BadRequestAlertException("New object cannot have an ID", ENTITY_NAME, "idExist");
        }
        if (tenantDTO.getName() == null) {
            throw new BadRequestAlertException("Object must have a name", ENTITY_NAME, "nameNotExist");
        }
        if (tenantRepository.findByName(tenantDTO.getName()).isPresent()) {
            throw new BadRequestAlertException("Name is being used", ENTITY_NAME, "nameNotUnique");
        }

        Tenant tenant = tenantMapper.toEntity(tenantDTO);
        tenant.setCreatedBy(user);
        tenant.setUpdated(ZonedDateTime.now());
        tenant.setCreated(ZonedDateTime.now());

        return tenantMapper.toDto(tenantRepository.save(tenant));
    }

    public Optional<TenantDTO> partialUpdate(TenantDTO tenantDTO) {
        log.debug("Request to partial update Tenant: {}", tenantDTO);

        if (tenantDTO.getId() == null) {
            throw new BadRequestAlertException("ID is not provided", ENTITY_NAME, "idNotProvided");
        }

        return tenantRepository
            .findById(tenantDTO.getId())
            .map(tenant -> {
                if (tenantDTO.getCreatedById() != null) {
                    final User updatedUser = userRepository.findById(tenantDTO.getCreatedById()).orElseThrow(
                        () -> new BadRequestAlertException("Could not found user while updating", ENTITY_NAME, "userNotFound")
                    );
                    tenant.setCreatedBy(updatedUser);
                }
                //tenantDTO.getCreatedById(null);
                tenantMapper.partialUpdate(tenant, tenantDTO);

                return tenant;
            })
            .map(tenantRepository::save)
            .map(tenantMapper::toDto);
    }

    public void delete(UUID id) {
        if (tenantRepository.findById(id).isPresent()) {
            tenantRepository.deleteById(id);
        } else {
            throw new BadRequestAlertException("Cannot find tenant with this ID", ENTITY_NAME, "tenantNotFound");
        }
    }
}
