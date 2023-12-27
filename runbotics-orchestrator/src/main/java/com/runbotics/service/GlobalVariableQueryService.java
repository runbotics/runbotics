package com.runbotics.service;

import com.runbotics.domain.*; // for static metamodels
import com.runbotics.domain.GlobalVariable;
import com.runbotics.repository.GlobalVariableRepository;
import com.runbotics.service.criteria.GlobalVariableCriteria;
import com.runbotics.service.dto.GlobalVariableDTO;
import com.runbotics.service.mapper.GlobalVariableMapper;
import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link GlobalVariable} entities in the database.
 * The main input is a {@link GlobalVariableCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link GlobalVariableDTO} or a {@link Page} of {@link GlobalVariableDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class GlobalVariableQueryService extends QueryService<GlobalVariable> {

    private final Logger log = LoggerFactory.getLogger(GlobalVariableQueryService.class);

    private final GlobalVariableRepository globalVariableRepository;

    private final GlobalVariableMapper globalVariableMapper;

    public GlobalVariableQueryService(GlobalVariableRepository globalVariableRepository, GlobalVariableMapper globalVariableMapper) {
        this.globalVariableRepository = globalVariableRepository;
        this.globalVariableMapper = globalVariableMapper;
    }

    /**
     * Return a {@link List} of {@link GlobalVariableDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<GlobalVariableDTO> findByCriteria(GlobalVariableCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<GlobalVariable> specification = createSpecification(criteria);
        return globalVariableMapper.toDto(globalVariableRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link GlobalVariableDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<GlobalVariableDTO> findByCriteria(GlobalVariableCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<GlobalVariable> specification = createSpecification(criteria);
        return globalVariableRepository.findAll(specification, page).map(globalVariableMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(GlobalVariableCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<GlobalVariable> specification = createSpecification(criteria);
        return globalVariableRepository.count(specification);
    }

    /**
     * Function to convert {@link GlobalVariableCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<GlobalVariable> createSpecification(GlobalVariableCriteria criteria) {
        Specification<GlobalVariable> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), GlobalVariable_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), GlobalVariable_.name));
            }
            if (criteria.getDescription() != null) {
                specification = specification.and(buildStringSpecification(criteria.getDescription(), GlobalVariable_.description));
            }
            if (criteria.getType() != null) {
                specification = specification.and(buildStringSpecification(criteria.getType(), GlobalVariable_.type));
            }
            if (criteria.getValue() != null) {
                specification = specification.and(buildStringSpecification(criteria.getValue(), GlobalVariable_.value));
            }
            if (criteria.getLastModified() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLastModified(), GlobalVariable_.lastModified));
            }
            if (criteria.getUserId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getUserId(), root -> root.join(GlobalVariable_.user, JoinType.LEFT).get(User_.id))
                    );
            }
            if (criteria.getCreatorId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getCreatorId(), root -> root.join(GlobalVariable_.creator, JoinType.LEFT).get(User_.id))
                    );
            }
        }
        return specification;
    }
}
