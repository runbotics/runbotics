package com.runbotics.service.impl;

import com.runbotics.domain.Tenant;
import com.runbotics.repository.TenantRepository;
import com.runbotics.service.TenantService;
import com.runbotics.service.criteria.TenantCriteria;
import com.runbotics.service.dto.TenantDTO;
import com.runbotics.service.mapper.TenantMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    public TenantServiceImpl(
        TenantRepository tenantRepository,
        TenantMapper tenantMapper
    ) {
        this.tenantRepository = tenantRepository;
        this.tenantMapper = tenantMapper;
    }

    public Page<TenantDTO> getAllByPage(Pageable pageable, TenantCriteria tenantCriteria) {
        if (tenantCriteria.getName() == null) {
            return tenantRepository.findAll(pageable).map(tenantMapper::toDto);
        }

        return tenantRepository.findAllByNameIsContainingIgnoreCase(
          pageable, tenantCriteria.getName().getContains()
        ).map(tenantMapper::toDto);
    }
}
