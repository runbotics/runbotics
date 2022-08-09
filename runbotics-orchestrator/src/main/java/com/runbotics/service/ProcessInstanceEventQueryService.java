package com.runbotics.service;

import com.runbotics.domain.*; // for static metamodels
import com.runbotics.domain.ProcessInstanceEvent;
import com.runbotics.repository.ProcessInstanceEventRepository;
import com.runbotics.service.criteria.ProcessInstanceEventCriteria;
import com.runbotics.service.dto.ProcessInstanceEventDTO;
import com.runbotics.service.mapper.ProcessInstanceEventMapper;
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
 * Service for executing complex queries for {@link ProcessInstanceEvent} entities in the database.
 * The main input is a {@link ProcessInstanceEventCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link ProcessInstanceEventDTO} or a {@link Page} of {@link ProcessInstanceEventDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProcessInstanceEventQueryService extends QueryService<ProcessInstanceEvent> {

    private final Logger log = LoggerFactory.getLogger(ProcessInstanceEventQueryService.class);

    private final ProcessInstanceEventRepository processInstanceEventRepository;

    private final ProcessInstanceEventMapper processInstanceEventMapper;

    public ProcessInstanceEventQueryService(
        ProcessInstanceEventRepository processInstanceEventRepository,
        ProcessInstanceEventMapper processInstanceEventMapper
    ) {
        this.processInstanceEventRepository = processInstanceEventRepository;
        this.processInstanceEventMapper = processInstanceEventMapper;
    }

    /**
     * Return a {@link List} of {@link ProcessInstanceEventDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<ProcessInstanceEventDTO> findByCriteria(ProcessInstanceEventCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<ProcessInstanceEvent> specification = createSpecification(criteria);
        return processInstanceEventMapper.toDto(processInstanceEventRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link ProcessInstanceEventDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProcessInstanceEventDTO> findByCriteria(ProcessInstanceEventCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ProcessInstanceEvent> specification = createSpecification(criteria);
        return processInstanceEventRepository.findAll(specification, page).map(processInstanceEventMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProcessInstanceEventCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<ProcessInstanceEvent> specification = createSpecification(criteria);
        return processInstanceEventRepository.count(specification);
    }

    /**
     * Function to convert {@link ProcessInstanceEventCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ProcessInstanceEvent> createSpecification(ProcessInstanceEventCriteria criteria) {
        Specification<ProcessInstanceEvent> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ProcessInstanceEvent_.id));
            }
            if (criteria.getCreated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated(), ProcessInstanceEvent_.created));
            }
            if (criteria.getStep() != null) {
                specification = specification.and(buildStringSpecification(criteria.getStep(), ProcessInstanceEvent_.step));
            }
            if (criteria.getProcessInstanceId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getProcessInstanceId(),
                            root -> root.join(ProcessInstanceEvent_.processInstance, JoinType.LEFT).get(ProcessInstance_.id)
                        )
                    );
            }
        }
        return specification;
    }
}
