package com.runbotics.service.impl;

import com.runbotics.domain.Tenant;
import com.runbotics.domain.TenantInviteCode;
import com.runbotics.domain.User;
import com.runbotics.repository.TenantInviteCodeRepository;
import com.runbotics.repository.TenantRepository;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.TenantService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.TenantCriteria;
import com.runbotics.service.dto.TenantDTO;
import com.runbotics.service.dto.TenantInviteCodeDTO;
import com.runbotics.service.mapper.TenantMapper;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import com.runbotics.web.rest.errors.PreDatabaseErrorHandler;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final TenantInviteCodeRepository tenantInviteCodeRepository;

    private final PreDatabaseErrorHandler preDatabaseErrorHandler;

    public TenantServiceImpl(
        TenantRepository tenantRepository,
        TenantMapper tenantMapper,
        UserService userService,
        UserRepository userRepository,
        TenantInviteCodeRepository tenantInviteCodeRepository,
        PreDatabaseErrorHandler preDatabaseErrorHandler
    ) {
        this.tenantRepository = tenantRepository;
        this.tenantMapper = tenantMapper;
        this.userService = userService;
        this.userRepository = userRepository;
        this.tenantInviteCodeRepository = tenantInviteCodeRepository;
        this.preDatabaseErrorHandler = preDatabaseErrorHandler;
    }

    public List<TenantDTO> getAll() {
        log.debug("Request to get all Tenants");
        return tenantRepository.findAll().stream().map(tenantMapper::toDto).collect(Collectors.toList());
    }

    public Page<TenantDTO> getAllByPage(Pageable pageable, TenantCriteria tenantCriteria) {
        if (tenantCriteria.getName() == null) {
            return tenantRepository.findAll(pageable).map(tenantMapper::toDto);
        }

        return tenantRepository.findAllByNameIsContainingIgnoreCase(
          pageable, tenantCriteria.getName().getContains()
        ).map(tenantMapper::toDto);
    }

    public Optional<TenantDTO> getById(UUID id) {
        log.debug("Request to get Tenant by id: {}", id);
        return tenantRepository.findById(id).map(tenantMapper::toDto);
    }

    public Optional<TenantDTO> getByRequester() {
        User requester = userService.getUserWithAuthorities().get();
        log.debug("Request to get Tenant by requester: {}", requester);

        return tenantRepository.findById(requester.getTenant().getId()).map(tenantMapper::toDto);
    }

    public TenantDTO save(TenantDTO tenantDTO) {
        log.debug("Request to save Tenant: {}", tenantDTO);

        final User currentUser = userService.getUserWithAuthorities().get();

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
        tenant.setCreatedBy(currentUser);
        tenant.setLastModifiedBy(currentUser.getEmail());
        tenant.setUpdated(ZonedDateTime.now());
        tenant.setCreated(ZonedDateTime.now());

        return tenantMapper.toDto(tenantRepository.save(tenant));
    }

    public Optional<TenantDTO> partialUpdate(TenantDTO tenantDTO) {
        log.debug("Request to partial update Tenant: {}", tenantDTO);

        tenantRepository.findByName(tenantDTO.getName()).ifPresent(tenant -> {
            if (!tenant.getId().equals(tenantDTO.getId())) {
                throw new BadRequestAlertException("Name is already used", ENTITY_NAME, "NameNotAvailable");
            }
        });

        final User currentUser = userService.getUserWithAuthorities().get();

        return tenantRepository
            .findById(tenantDTO.getId())
            .map(tenant -> {
                if (tenantDTO.getCreatedBy() != null) {
                    final User updatedUser = userRepository.findById(tenantDTO.getCreatedBy().getId()).orElseThrow(
                        () -> new BadRequestAlertException("Could not found user while updating", ENTITY_NAME, "UserNotFound")
                    );
                    tenant.setCreatedBy(updatedUser);
                }
                tenantDTO.setUpdated(ZonedDateTime.now());
                tenantDTO.setLastModifiedBy(currentUser.getEmail());
                tenantMapper.partialUpdate(tenant, tenantDTO);

                    return tenant;
                }
            )
            .map(tenantRepository::save)
            .map(tenantMapper::toDto);
    }

    public void delete(UUID id) {
        if (tenantRepository.findById(id).isPresent()) {
            if (preDatabaseErrorHandler.tenantResourceRelationCheck(id)) {
                throw new BadRequestAlertException("Cannot delete tenant related to other resources", ENTITY_NAME, "tenantRelationExist");
            }

            tenantRepository.deleteById(id);
        } else {
            throw new BadRequestAlertException("Cannot find tenant with this ID", ENTITY_NAME, "tenantNotFound");
        }
    }

    public Optional<TenantInviteCodeDTO> getActiveInviteCode(UUID tenantId) {
        final User user = userService.getUserWithAuthorities().get();

        if (userService.hasAdminRole(user)) {
            if (tenantId == null) {
                throw new BadRequestAlertException("Tenant is not defined by ID", ENTITY_NAME, "idNotFound");
            }
            return tenantInviteCodeRepository
                .findByTenantIdAndExpirationDateBefore(
                    tenantId, ZonedDateTime.now()
                ).map(TenantInviteCodeDTO::new);
        }

        return tenantInviteCodeRepository
            .findByTenantIdAndExpirationDateBefore(
                user.getTenant().getId(), ZonedDateTime.now()
            ).map(TenantInviteCodeDTO::new);
    }

    public TenantInviteCodeDTO generateInviteCode(UUID tenantId) {
        final User user = userService.getUserWithAuthorities().get();
        TenantInviteCode newInviteCode = new TenantInviteCode();

        if (userService.hasAdminRole(user)) {
            if (tenantId == null) {
                throw new BadRequestAlertException("Tenant is not defined by ID", ENTITY_NAME, "idNotFound");
            }

            Tenant tenant = tenantRepository.findById(tenantId).orElseThrow(
                () -> new BadRequestAlertException("Cannot find tenant by ID", ENTITY_NAME, "tenantNotFound")
            );

            newInviteCode.setTenantId(tenantId);
        } else {
            newInviteCode.setTenantId(user.getTenant().getId());
        }

        ZonedDateTime actualTime = ZonedDateTime.now();
        newInviteCode.setCreationDate(actualTime);
        newInviteCode.setExpirationDate(actualTime.plusWeeks(1));

        return new TenantInviteCodeDTO(tenantInviteCodeRepository.save(newInviteCode));
    }
}
