package com.runbotics.service;

import com.runbotics.domain.*; // for static metamodels
import com.runbotics.domain.User;
import com.runbotics.repository.UserRepository;
import com.runbotics.service.criteria.UserCriteria;
import com.runbotics.service.dto.UserDTO;
import com.runbotics.service.dto.AdminUserDTO;
import com.runbotics.service.mapper.UserMapper;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link User} entities in the database.
 * The main input is a {@link UserCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link UserDTO} / {@link AdminUserDTO},
 * or a {@link Page} of {@link UserDTO} / {@link AdminUserDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class UserQueryService extends QueryService<User>{
    private final Logger log = LoggerFactory.getLogger(UserQueryService.class);

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public UserQueryService(
        UserRepository userRepository,
        UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    /**
     * Return a {@link List} of {@link AdminUserDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<AdminUserDTO> findByCriteria(UserCriteria criteria) {
        log.debug("find by criteria: {}", criteria);
        final Specification<User> specification = createSpecification(criteria);
        return userRepository
            .findAll(specification)
            .stream()
            .map(userMapper::userToAdminUserDTO)
            .collect(Collectors.toList());
    }

    /**
     * Return a {@link Page} of {@link AdminUserDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<AdminUserDTO> findByCriteria(UserCriteria criteria, Pageable page) {
        log.debug("find by criteria: {}, page: {}", criteria, page);
        final Specification<User> specification = createSpecification(criteria);
        return userRepository.findAll(specification, page).map(userMapper::userToAdminUserDTO);
    }

    /**
     * Function to convert {@link UserCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<User> createSpecification(UserCriteria criteria) {
        Specification<User> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getEmail() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEmail(), User_.email));
            }

            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), User_.id));
            }
        }

        return specification;
    }
}
