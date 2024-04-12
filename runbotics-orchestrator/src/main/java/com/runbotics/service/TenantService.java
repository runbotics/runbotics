package com.runbotics.service;

import com.runbotics.domain.Tenant;
import com.runbotics.service.dto.TenantDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service Interface for managing {@link Tenant}.
 */
public interface TenantService {
    List<TenantDTO> getAll();

    Optional<TenantDTO> getById(UUID id);

    TenantDTO save(TenantDTO tenantDTO);

    Optional<TenantDTO> partialUpdate(TenantDTO tenantDTO);

    void delete(UUID id);
}
