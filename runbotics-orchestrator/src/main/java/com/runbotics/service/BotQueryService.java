package com.runbotics.service;

import com.runbotics.domain.*; // for static metamodels
import com.runbotics.domain.Bot;
import com.runbotics.repository.BotRepository;
import com.runbotics.service.criteria.BotCriteria;
import com.runbotics.service.dto.BotDTO;
import com.runbotics.service.mapper.BotMapper;
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
 * Service for executing complex queries for {@link Bot} entities in the database.
 * The main input is a {@link BotCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link BotDTO} or a {@link Page} of {@link BotDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class BotQueryService extends QueryService<Bot> {

    private final Logger log = LoggerFactory.getLogger(BotQueryService.class);

    private final BotRepository botRepository;
    private final BotMapper botMapper;
    private final BotService botService;

    public BotQueryService(BotRepository botRepository, BotMapper botMapper, BotService botService) {
        this.botRepository = botRepository;
        this.botMapper = botMapper;
        this.botService = botService;
    }

    /**
     * Return a {@link List} of {@link BotDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<BotDTO> findByCriteria(BotCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Bot> specification = createSpecification(criteria);
        return botMapper.toDto(botRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link BotDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<BotDTO> findByCriteria(BotCriteria criteria, Pageable page) {
        if (criteria.getCollection() != null) {
            log.debug("find by criteria with collections filter : {}, page: {}", criteria, page);
            return this.botRepository
                .findAllByCollectionNames(
                    page, criteria.getCollection().getIn()
                ).map(botMapper::toDto);
        }
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Bot> specification = createSpecification(criteria);
        return botRepository.findAll(specification, page).map(botMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(BotCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Bot> specification = createSpecification(criteria);
        return botRepository.count(specification);
    }

    /**
     * Function to convert {@link BotCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Bot> createSpecification(BotCriteria criteria) {
        Specification<Bot> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Bot_.id));
            }
            if (criteria.getInstallationId() != null) {
                specification = specification.and(buildStringSpecification(criteria.getInstallationId(), Bot_.installationId));
            }
            if (criteria.getCreated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated(), Bot_.created));
            }
            if (criteria.getLastConnected() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLastConnected(), Bot_.lastConnected));
            }
            if (criteria.getUserId() != null) {
                specification =
                    specification.and(buildSpecification(criteria.getUserId(), root -> root.join(Bot_.user, JoinType.LEFT).get(User_.id)));
            }
        }
        return specification;
    }
}
