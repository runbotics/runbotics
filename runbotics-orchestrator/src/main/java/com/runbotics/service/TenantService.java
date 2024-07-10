package com.runbotics.service;

import com.runbotics.domain.Tenant;
import com.runbotics.service.criteria.TenantCriteria;
import com.runbotics.service.dto.TenantDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Tenant}.
 */
public interface TenantService {
    Page<TenantDTO> getAllByPage(Pageable pageable, TenantCriteria tenantCriteria);
}
