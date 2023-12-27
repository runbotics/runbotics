package com.runbotics.service;

import com.runbotics.domain.User;
import com.runbotics.service.criteria.BotCriteria;
import com.runbotics.service.dto.BotDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.runbotics.domain.Bot}.
 */
public interface BotService {
    /**
     * Save a bot.
     *
     * @param botDTO the entity to save.
     * @return the persisted entity.
     */
    BotDTO save(BotDTO botDTO);

    /**
     * Partially updates a bot.
     *
     * @param botDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<BotDTO> partialUpdate(BotDTO botDTO);

    /**
     * Get all the bots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BotDTO> findAll(Pageable pageable);

    /**
     * Get the "id" bot.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<BotDTO> findOne(Long id);
    Optional<BotDTO> findByInstallationId(String installationId);

    /**
     * Delete the "id" bot.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<BotDTO> saveAll(List<BotDTO> bots);

    Page<BotDTO> getBotsForUser(BotCriteria criteria, Pageable page, User user);
}
