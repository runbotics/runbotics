package com.runbotics.service;

import com.runbotics.domain.*;
import com.runbotics.repository.BotCollectionRepository;
import com.runbotics.service.criteria.BotCollectionCriteria;
import com.runbotics.service.dto.BotCollectionDTO;
import com.runbotics.service.mapper.BotCollectionMapper;
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

@Service
@Transactional(readOnly = true)
public class BotCollectionQueryService extends QueryService<BotCollection> {

    private final Logger log = LoggerFactory.getLogger(BotCollectionQueryService.class);

    private final BotCollectionRepository botCollectionRepository;

    private final BotCollectionMapper botCollectionMapper;

    public BotCollectionQueryService(BotCollectionRepository botCollectionRepository, BotCollectionMapper botCollectionMapper) {
        this.botCollectionRepository = botCollectionRepository;
        this.botCollectionMapper = botCollectionMapper;
    }

    @Transactional(readOnly = true)
    public List<BotCollectionDTO> findByCriteria(BotCollectionCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<BotCollection> specification = createSpecification(criteria);
        return botCollectionMapper.toDto(botCollectionRepository.findAll(specification));
    }

    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> findByCriteria(BotCollectionCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<BotCollection> specification = createSpecification(criteria);
        return botCollectionRepository.findAll(specification, page).map(botCollectionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Page<BotCollectionDTO> findByCriteria(BotCollectionCriteria criteria, String username, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<BotCollection> specification = createSpecification(criteria);
        if (criteria.getPublicBotsIncluded() != null) {
            return botCollectionRepository
                .findDistinctByPublicBotsIncludedAndCreatedByLoginOrUsers_Login(
                    criteria.getPublicBotsIncluded().getEquals(),
                    username,
                    username,
                    page
                )
                .map(botCollectionMapper::toDto);
        }
        if (criteria.getCreatedByName() != null) {
            return botCollectionRepository
                .findDistinctByCreatedByLoginContains(criteria.getCreatedByName().getContains(), page)
                .map(botCollectionMapper::toDto);
        }
        return botCollectionRepository.findAll(specification, page).map(botCollectionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long countByCriteria(BotCollectionCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<BotCollection> specification = createSpecification(criteria);
        return botCollectionRepository.count(specification);
    }

    protected Specification<BotCollection> createSpecification(BotCollectionCriteria criteria) {
        Specification<BotCollection> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), BotCollection_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), BotCollection_.name));
            }
            if (criteria.getPublicBotsIncluded() != null) {
                specification = specification.and(buildSpecification(criteria.getPublicBotsIncluded(), BotCollection_.publicBotsIncluded));
            }
            if (criteria.getCreated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreated(), BotCollection_.created));
            }
            if (criteria.getUpdated() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUpdated(), BotCollection_.updated));
            }
            if (criteria.getCreatedBy() != null) {
                specification =
                    specification.and(
                        buildSpecification(
                            criteria.getCreatedBy(),
                            root -> root.join(BotCollection_.createdBy, JoinType.LEFT).get(User_.id)
                        )
                    );
            }
        }
        return specification;
    }
}
