package com.runbotics.service;

import com.runbotics.domain.Process;
import com.runbotics.domain.Process_;
import com.runbotics.domain.User_;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.repository.ScheduleProcessRepository;
import com.runbotics.service.criteria.ProcessCriteria;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.mapper.ProcessMapper;
import java.util.Comparator;
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
 * Service for executing complex queries for {@link Process} entities in the
 * database.
 * The main input is a {@link ProcessCriteria} which gets converted to
 * {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link ProcessDTO} or a {@link Page} of
 * {@link ProcessDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProcessQueryService extends QueryService<Process> {

    private final Logger log = LoggerFactory.getLogger(ProcessQueryService.class);

    private final ProcessRepository processRepository;
    private final ScheduleProcessRepository scheduleProcessRepository;

    private final ProcessMapper processMapper;

    private final UserService userService;

    public ProcessQueryService(
        ProcessRepository processRepository,
        ProcessMapper processMapper,
        ScheduleProcessRepository scheduleProcessRepository,
        UserService userService
    ) {
        this.processRepository = processRepository;
        this.processMapper = processMapper;
        this.scheduleProcessRepository = scheduleProcessRepository;
        this.userService = userService;
    }

    /**
     * Return a {@link List} of {@link ProcessDTO} which matches the criteria from
     * the database.
     *
     * @param criteria The object which holds all the filters, which the entities
     *                 should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<ProcessDTO> findByCriteria(ProcessCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        var userLogin = userService.getUserWithAuthorities().get().getLogin();
        final Specification<Process> specification = createSpecification(criteria);
        if (criteria.getCreatedByName() != null) {
            return processRepository
                .findByCreatedByUser(criteria.getCreatedByName().getContains(), userLogin)
                .stream()
                .sorted(Comparator.comparing(Process::getUpdated).reversed())
                .map(processMapper::toDto)
                .collect(Collectors.toList());
        }
        if (criteria.getBotCollectionName() != null) {
            return processRepository
                .findByBotCollection(criteria.getBotCollectionName().getContains(), userLogin)
                .stream()
                .sorted(Comparator.comparing(Process::getUpdated).reversed())
                .map(processMapper::toDto)
                .collect(Collectors.toList());
        }
        return processRepository
            .findAll(specification)
            .stream()
            .sorted(Comparator.comparing(Process::getUpdated).reversed())
            .map(processMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Return a {@link Page} of {@link ProcessDTO} which matches the criteria from
     * the database.
     *
     * @param criteria The object which holds all the filters, which the entities
     *                 should match.
     * @param page     The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProcessDTO> findByCriteria(ProcessCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        var userLogin = userService.getUserWithAuthorities().get().getLogin();
        final Specification<Process> specification = createSpecification(criteria);
        if (criteria.getCreatedByName() != null) {
            return processRepository
                .findByCreatedByUser(criteria.getCreatedByName().getContains(), userLogin, page)
                .map(processMapper::toDto);
        }
        if (criteria.getBotCollectionName() != null) {
            return processRepository
                .findByBotCollection(criteria.getBotCollectionName().getContains(), userLogin, page)
                .map(processMapper::toDto);
        }

        return processRepository.findAll(specification, page).map(processMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     *
     * @param criteria The object which holds all the filters, which the entities
     *                 should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProcessCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Process> specification = createSpecification(criteria);
        return processRepository.count(specification);
    }

    /**
     * Function to convert {@link ProcessCriteria} to a {@link Specification}
     *
     * @param criteria The object which holds all the filters, which the entities
     *                 should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Process> createSpecification(ProcessCriteria criteria) {
        Specification<Process> specification = Specification.where(null);
        Specification<Process> userIdAndPublicSpec = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Process_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Process_.name));
            }
            if (criteria.getCreated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated(), Process_.created));
            }
            if (criteria.getUpdated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdated(), Process_.updated));
            }
            if (criteria.getExecutionsCount() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getExecutionsCount(), Process_.executionsCount));
            }
            if (criteria.getSuccessExecutionsCount() != null) {
                specification =
                    specification.and(buildRangeSpecification(criteria.getSuccessExecutionsCount(), Process_.successExecutionsCount));
            }
            if (criteria.getFailureExecutionsCount() != null) {
                specification =
                    specification.and(buildRangeSpecification(criteria.getFailureExecutionsCount(), Process_.failureExecutionsCount));
            }
            if (criteria.getIsPublic() != null) {
                userIdAndPublicSpec = userIdAndPublicSpec.or(buildSpecification(criteria.getIsPublic(), Process_.isPublic));
            } else {
                log.debug("public null");
                userIdAndPublicSpec = userIdAndPublicSpec.or(isPublic());
            }
        } else {
            userIdAndPublicSpec = userIdAndPublicSpec.or(isPublic());
        }
        userIdAndPublicSpec = userIdAndPublicSpec.or(isCreatedByUser());
        specification = specification.and(userIdAndPublicSpec);
        return specification;
    }

    private Specification<Process> isCreatedByUser() {
        var userId = userService.getUserWithAuthorities().get().getId();
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Process_.createdBy).get(User_.id), userId);
    }

    private Specification<Process> isPublic() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get(Process_.isPublic));
    }
}
