package com.runbotics.repository;

import com.runbotics.domain.TenantInviteCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA repository for the {@link TenantInviteCode} entity.
 */
@Repository
public interface TenantInviteCodeRepository extends JpaRepository<TenantInviteCode, UUID>, JpaSpecificationExecutor<TenantInviteCode> {
}
