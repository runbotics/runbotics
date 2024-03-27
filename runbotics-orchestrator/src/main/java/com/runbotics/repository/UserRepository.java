package com.runbotics.repository;

import com.runbotics.domain.FeatureKey;
import com.runbotics.domain.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String id);

    Optional<User> findOneById(Long id);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByLoginNot(Pageable pageable, String login);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    Page<User> findAllByActivatedIsTrue(Pageable pageable);

    Page<User> findAllByActivatedIsFalse(Pageable pageable);

    Page<User> findAllByActivatedIsTrueAndEmailIsContaining(Pageable pageable, String email);

    Page<User> findAllByActivatedIsFalseAndEmailIsContaining(Pageable pageable, String email);

    @Query(
        value =
            "SELECT * " +
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

    @Query(
        "SELECT u FROM User u WHERE u.id != ?1 AND (u.email = ?2 OR u.login = ?3)"
    )
    Optional<User> findOtherUserByLoginOrEmail(Long id, String email, String login);
}
