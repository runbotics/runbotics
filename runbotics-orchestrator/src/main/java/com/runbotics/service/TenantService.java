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
    List<TenantDTO> getAll();

    Page<TenantDTO> getAllByPage(Pageable pageable, TenantCriteria tenantCriteria);

    Optional<TenantDTO> getById(UUID id);

    Optional<TenantDTO> getByRequester();

    TenantDTO save(TenantDTO tenantDTO);

    Optional<TenantDTO> partialUpdate(TenantDTO tenantDTO);

    void delete(UUID id);

    Optional<TenantInviteCodeDTO> getActiveInviteCode(UUID tenantId);

    TenantInviteCodeDTO generateInviteCode(UUID tenantId);
}
