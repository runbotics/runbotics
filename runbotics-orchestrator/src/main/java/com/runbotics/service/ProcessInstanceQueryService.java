package com.runbotics.service;

import com.runbotics.domain.Bot_;
import com.runbotics.domain.Process;
import com.runbotics.domain.ProcessInstance;
import com.runbotics.domain.ProcessInstance_;
import com.runbotics.domain.Process_;
import com.runbotics.repository.ProcessInstanceRepository;
import com.runbotics.service.criteria.ProcessInstanceCriteria;
import com.runbotics.service.dto.ProcessInstanceDTO;
import com.runbotics.service.mapper.ProcessInstanceMapper;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link ProcessInstance} entities in the database.
 * The main input is a {@link ProcessInstanceCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link ProcessInstanceDTO} or a {@link Page} of {@link ProcessInstanceDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ProcessInstanceQueryService extends QueryService<ProcessInstance> {

    private final Logger log = LoggerFactory.getLogger(ProcessInstanceQueryService.class);

    private final ProcessInstanceRepository processInstanceRepository;

    private final ProcessInstanceMapper processInstanceMapper;

    public ProcessInstanceQueryService(ProcessInstanceRepository processInstanceRepository, ProcessInstanceMapper processInstanceMapper) {
        this.processInstanceRepository = processInstanceRepository;
        this.processInstanceMapper = processInstanceMapper;
    }

    /**
     * Return a {@link List} of {@link ProcessInstanceDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<ProcessInstanceDTO> findByCriteria(ProcessInstanceCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        if (criteria.getStatus() != null) {
            return processInstanceMapper.toDto(
                processInstanceRepository
                    .findByStatus(criteria.getStatus())
                    .stream()
                    .sorted(Comparator.comparing(ProcessInstance::getCreated).reversed())
                    .collect(Collectors.toList()));
        }
        final Specification<ProcessInstance> specification = createSpecification(criteria);
        return processInstanceMapper.toDto(
            processInstanceRepository
                .findAll(specification)
                .stream()
                .sorted(Comparator.comparing(ProcessInstance::getCreated).reversed())
                .collect(Collectors.toList()));

    }

    /**
     * Return a {@link Page} of {@link ProcessInstanceDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProcessInstanceDTO> findByCriteria(ProcessInstanceCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        if (criteria.getProcessName() != null) {
            return processInstanceRepository
                .findAllByProcessName(criteria.getProcessName().getContains(), page)
                .map(processInstanceMapper::toDto);
        }
        if (criteria.getBotInstallationId() != null) {
            return processInstanceRepository
                .findAllByBotInstallationId(criteria.botInstallationId().getContains(), page)
                .map(processInstanceMapper::toDto);
        }

        if (criteria.getCreatedByName() != null) {
            return processInstanceRepository
                .findAllByCreatedByName(criteria.getCreatedByName().getContains(), page)
                .map(processInstanceMapper::toDto);
        }

        final Specification<ProcessInstance> specification = createSpecification(criteria);
        return processInstanceRepository.findAll(specification, page).map(processInstanceMapper::toDto);
    }

    /**
     * Return a {@link Page} of {@link ProcessInstanceDTO} which matches the criteria from the database and also contains enity with provided id.
     * @param id The id of entity which should appear in the {@link Page} of {@link ProcessInstanceDTO}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ProcessInstanceDTO> findByCriteriaWithSpecificInstance(UUID id, ProcessInstanceCriteria criteria, Pageable page) {
        final Specification<ProcessInstance> specification = createSpecification(criteria);
        List<ProcessInstance> myList = processInstanceRepository.findAll(specification, page.getSort());
        int index = -1;
        for (int i = 0; i < myList.size(); i++) {
            if (myList.get(i).getId().equals(id)) {
                index = i;
                break;
            }
        }
        int pageNumber = index / page.getPageSize();
        if (pageNumber < 0) {
            pageNumber = 0;
        }
        Pageable newPageable = PageRequest.of(pageNumber, page.getPageSize(), page.getSort());
        Page<ProcessInstanceDTO> foundInstances = processInstanceRepository.findAll(specification, newPageable).map(processInstanceMapper::toDto);
        return foundInstances;
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ProcessInstanceCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<ProcessInstance> specification = createSpecification(criteria);
        return processInstanceRepository.count(specification);
    }

    /**
     * Function to convert {@link ProcessInstanceCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ProcessInstance> createSpecification(ProcessInstanceCriteria criteria) {
        Specification<ProcessInstance> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), ProcessInstance_.id));
            }
            if (criteria.getOrchestratorProcessInstanceId() != null) {
                specification =
                    specification.and(
                        buildStringSpecification(
                            criteria.getOrchestratorProcessInstanceId(),
                            ProcessInstance_.orchestratorProcessInstanceId
                        )
                    );
            }
            if (criteria.getCreated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated(), ProcessInstance_.created));
            }
            if (criteria.getUpdated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdated(), ProcessInstance_.updated));
            }
            if (criteria.getStep() != null) {
                specification = specification.and(buildStringSpecification(criteria.getStep(), ProcessInstance_.step));
            }
            if (criteria.getProcessId() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getProcessId(),
                            root -> root.join(ProcessInstance_.process, JoinType.LEFT).get(Process_.id)
                        )
                    );
            }
            if (criteria.getBotId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getBotId(), root -> root.join(ProcessInstance_.bot, JoinType.LEFT).get(Bot_.id))
                    );
            }

            specification = specification.and(isRootProcessInstance());
        }
        return specification;
    }

    private Specification<ProcessInstance> isRootProcessInstance() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get(ProcessInstance_.rootProcessInstanceId));
    }
}
