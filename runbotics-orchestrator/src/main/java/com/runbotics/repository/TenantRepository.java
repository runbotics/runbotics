package com.runbotics.repository;

import com.runbotics.domain.Tenant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link Tenant} entity.
 */
@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID>, JpaSpecificationExecutor<Tenant> {
    Page<Tenant> findAllByNameIsContainingIgnoreCase(Pageable pageable, String name);
    @Query(
        "SELECT t FROM Tenant t LEFT JOIN TenantInviteCode tic ON t.id = tic.tenantId WHERE tic.id = ?1"
    )
    Optional<Tenant> findByInviteCode(UUID inviteCode);
}
