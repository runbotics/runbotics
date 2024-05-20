package com.runbotics.service;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.domain.ProcessCollection_;
import com.runbotics.domain.User_;
import com.runbotics.repository.ProcessCollectionRepository;
import com.runbotics.service.criteria.ProcessCollectionCriteria;
import com.runbotics.service.dto.ProcessCollectionDTO;
import com.runbotics.service.mapper.ProcessCollectionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

import javax.persistence.criteria.JoinType;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProcessCollectionQueryService extends QueryService<ProcessCollection> {

    private final Logger log = LoggerFactory.getLogger(ProcessCollectionQueryService.class);

    private final ProcessCollectionRepository processCollectionRepository;

    private final ProcessCollectionMapper processCollectionMapper;

    public ProcessCollectionQueryService(ProcessCollectionRepository processCollectionRepository, ProcessCollectionMapper processCollectionMapper) {
        this.processCollectionRepository = ProcessCollectionQueryService.this.processCollectionRepository;
        this.processCollectionMapper = processCollectionMapper;
    }

    @Transactional(readOnly = true)
    public List<ProcessCollectionDTO> findByCriteria(ProcessCollectionCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<ProcessCollection> specification = createSpecification(criteria);
        return processCollectionMapper.toDto(processCollectionRepository.findAll(specification));
    }

    @Transactional(readOnly = true)
    public Page<ProcessCollectionDTO> findByCriteria(ProcessCollectionCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ProcessCollection> specification = createSpecification(criteria);
        return processCollectionRepository.findAll(specification, page).map(processCollectionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long countByCriteria(ProcessCollectionCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<ProcessCollection> specification = createSpecification(criteria);
        return processCollectionRepository.count(specification);
    }

    protected Specification<ProcessCollection> createSpecification(ProcessCollectionCriteria criteria) {
        Specification<ProcessCollection> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), ProcessCollection_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), ProcessCollection_.name));
            }
            if (criteria.getIsPublic() != null) {
                specification = specification.and(buildSpecification(criteria.getIsPublic(), ProcessCollection_.isPublic));
            }
            if (criteria.getParentId() != null) {
                specification = specification.and(buildSpecification(criteria.getParentId(), ProcessCollection_.parentId));
            }
            if (criteria.getCreated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated(), ProcessCollection_.created));
            }
            if (criteria.getUpdated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdated(), ProcessCollection_.updated));
            }
            if (criteria.getCreatedBy() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getCreatedBy(),
                            root -> root.join(ProcessCollection_.createdBy, JoinType.LEFT).get(User_.id)
                        )
                    );
            }
            if (criteria.getCreatedByName() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getCreatedByName(),
                            root -> root.join(ProcessCollection_.createdBy, JoinType.LEFT).get(User_.email)
                        )
                    );
            }
        }
        return specification;
    }
}
