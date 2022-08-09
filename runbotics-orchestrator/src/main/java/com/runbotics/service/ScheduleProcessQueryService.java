package com.runbotics.service;

import com.runbotics.domain.*; // for static metamodels
import com.runbotics.domain.ScheduleProcess;
import com.runbotics.repository.ScheduleProcessRepository;
import com.runbotics.service.criteria.ScheduleProcessCriteria;
import com.runbotics.service.dto.ScheduleProcessDTO;
import com.runbotics.service.mapper.ScheduleProcessMapper;
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
 * Service for executing complex queries for {@link ScheduleProcess} entities in the database.
 * The main input is a {@link ScheduleProcessCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link ScheduleProcessDTO} or a {@link Page} of {@link ScheduleProcessDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ScheduleProcessQueryService extends QueryService<ScheduleProcess> {

    private final Logger log = LoggerFactory.getLogger(ScheduleProcessQueryService.class);

    private final ScheduleProcessRepository scheduleProcessRepository;

    private final ScheduleProcessMapper scheduleProcessMapper;

    public ScheduleProcessQueryService(ScheduleProcessRepository scheduleProcessRepository, ScheduleProcessMapper scheduleProcessMapper) {
        this.scheduleProcessRepository = scheduleProcessRepository;
        this.scheduleProcessMapper = scheduleProcessMapper;
    }

    /**
     * Return a {@link List} of {@link ScheduleProcessDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<ScheduleProcessDTO> findByCriteria(ScheduleProcessCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<ScheduleProcess> specification = createSpecification(criteria);
        return scheduleProcessMapper.toDto(scheduleProcessRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link ScheduleProcessDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ScheduleProcessDTO> findByCriteria(ScheduleProcessCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ScheduleProcess> specification = createSpecification(criteria);
        return scheduleProcessRepository.findAll(specification, page).map(scheduleProcessMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ScheduleProcessCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<ScheduleProcess> specification = createSpecification(criteria);
        return scheduleProcessRepository.count(specification);
    }

    /**
     * Function to convert {@link ScheduleProcessCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ScheduleProcess> createSpecification(ScheduleProcessCriteria criteria) {
        Specification<ScheduleProcess> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ScheduleProcess_.id));
            }
            if (criteria.getCron() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCron(), ScheduleProcess_.cron));
            }
            if (criteria.getProcessId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getProcessId(),
                            root -> root.join(ScheduleProcess_.process, JoinType.LEFT).get(Process_.id)
                        )
                    );
            }
        }
        return specification;
    }
}
