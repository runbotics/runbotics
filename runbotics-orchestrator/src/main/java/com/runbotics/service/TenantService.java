package com.runbotics.service;

import com.runbotics.domain.Tenant;
import com.runbotics.service.criteria.TenantCriteria;
import com.runbotics.service.dto.TenantDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.runbotics.service.dto.TenantInviteCodeDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service Interface for managing {@link Tenant}.
 */
public interface TenantService {
    Page<TenantDTO> getAllByPage(Pageable pageable, TenantCriteria tenantCriteria);

    void delete(UUID id);
}
