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
    private final PreDatabaseErrorHandler preDatabaseErrorHandler;

    public TenantServiceImpl(
        TenantRepository tenantRepository,
        TenantMapper tenantMapper,
        PreDatabaseErrorHandler preDatabaseErrorHandler
    ) {
        this.tenantRepository = tenantRepository;
        this.tenantMapper = tenantMapper;
        this.preDatabaseErrorHandler = preDatabaseErrorHandler;
    }

    public Page<TenantDTO> getAllByPage(Pageable pageable, TenantCriteria tenantCriteria) {
        if (tenantCriteria.getName() == null) {
            return tenantRepository.findAll(pageable).map(tenantMapper::toDto);
        }

        return tenantRepository.findAllByNameIsContainingIgnoreCase(
          pageable, tenantCriteria.getName().getContains()
        ).map(tenantMapper::toDto);
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
}
