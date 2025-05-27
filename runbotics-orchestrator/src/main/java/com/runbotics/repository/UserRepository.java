package com.runbotics.repository;

import com.runbotics.domain.Tenant;
import com.runbotics.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Long countAllByTenantId(UUID tenantId);

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    List<User> findAllByHasBeenActivatedIsFalseAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneById(Long id);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByEmail(String email);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    Page<User> findAllByActivatedIsTrue(Pageable pageable);

    Page<User> findAllByActivatedIsTrueAndTenant(Pageable pageable, Tenant tenant);

    Page<User> findAllByActivatedIsFalse(Pageable pageable);

    Page<User> findAllByActivatedIsFalseAndTenant(Pageable pageable, Tenant tenant);

    Page<User> findAllByActivatedIsTrueAndEmailIsContaining(Pageable pageable, String email);

    Page<User> findAllByActivatedIsTrueAndEmailIsContainingAndTenant(Pageable pageable, String email, Tenant tenant);

    Page<User> findAllByActivatedIsFalseAndEmailIsContaining(Pageable pageable, String email);

    Page<User> findAllByActivatedIsFalseAndEmailIsContainingAndTenant(Pageable pageable, String email, Tenant tenant);

    @Query(
        value = "SELECT * " +
        "FROM jhi_user ju " +
        "WHERE NOT EXISTS ( " +
        "SELECT 1 " +
        "FROM jhi_user_authority " +
        "WHERE user_id = ju.id " +
        "AND authority_name = 'ROLE_ADMIN' " +
        ");",
        nativeQuery = true
    )
    List<User> findAllActivatedNonAdmins();

    @Query("SELECT u FROM User u WHERE u.id != ?1 AND u.email = ?2")
    Optional<User> findOtherUserByEmail(Long id, String email);
}
