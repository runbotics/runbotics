package com.runbotics.service;

import com.runbotics.domain.Tag;
import com.runbotics.domain.Tag_;
import com.runbotics.repository.TagRepository;
import com.runbotics.service.criteria.TagCriteria;
import com.runbotics.service.dto.TagDTO;
import com.runbotics.service.mapper.TagMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TagQueryService extends QueryService<Tag> {

    private final Logger log = LoggerFactory.getLogger(TagQueryService.class);

    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    public TagQueryService(
        TagRepository tagRepository,
        TagMapper tagMapper
    ) {
        this.tagRepository = tagRepository;
        this.tagMapper = tagMapper;
    }

    /**
     * Return a {@link List} of {@link TagDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<TagDTO> findByCriteria(TagCriteria criteria) {
        log.debug("find by criteria: {}", criteria);
        final Specification<Tag> specification = createSpecification(criteria);
        return tagRepository
            .findAll(specification)
            .stream()
            .map(tagMapper::toDto)
            .collect(Collectors.toList());
    }

    /**
     * Function to convert {@link TagCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Tag> createSpecification(TagCriteria criteria) {
        Specification<Tag> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Tag_.name));
            }

            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Tag_.id));
            }
        }

        return specification;
    }

}
