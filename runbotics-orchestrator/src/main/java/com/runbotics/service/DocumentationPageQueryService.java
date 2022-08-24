package com.runbotics.service;

import com.runbotics.domain.*; // for static metamodels
import com.runbotics.domain.DocumentationPage;
import com.runbotics.repository.DocumentationPageRepository;
import com.runbotics.service.criteria.DocumentationPageCriteria;
import com.runbotics.service.dto.DocumentationPageDTO;
import com.runbotics.service.mapper.DocumentationPageMapper;
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
 * Service for executing complex queries for {@link DocumentationPage} entities in the database.
 * The main input is a {@link DocumentationPageCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link DocumentationPageDTO} or a {@link Page} of {@link DocumentationPageDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class DocumentationPageQueryService extends QueryService<DocumentationPage> {

    private final Logger log = LoggerFactory.getLogger(DocumentationPageQueryService.class);

    private final DocumentationPageRepository documentationPageRepository;

    private final DocumentationPageMapper documentationPageMapper;

    public DocumentationPageQueryService(
        DocumentationPageRepository documentationPageRepository,
        DocumentationPageMapper documentationPageMapper
    ) {
        this.documentationPageRepository = documentationPageRepository;
        this.documentationPageMapper = documentationPageMapper;
    }

    /**
     * Return a {@link List} of {@link DocumentationPageDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<DocumentationPageDTO> findByCriteria(DocumentationPageCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<DocumentationPage> specification = createSpecification(criteria);
        return documentationPageMapper.toDto(documentationPageRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link DocumentationPageDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<DocumentationPageDTO> findByCriteria(DocumentationPageCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<DocumentationPage> specification = createSpecification(criteria);
        return documentationPageRepository.findAll(specification, page).map(documentationPageMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(DocumentationPageCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<DocumentationPage> specification = createSpecification(criteria);
        return documentationPageRepository.count(specification);
    }

    /**
     * Function to convert {@link DocumentationPageCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<DocumentationPage> createSpecification(DocumentationPageCriteria criteria) {
        Specification<DocumentationPage> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), DocumentationPage_.id));
            }
            if (criteria.getTitle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTitle(), DocumentationPage_.title));
            }
        }
        return specification;
    }
}
