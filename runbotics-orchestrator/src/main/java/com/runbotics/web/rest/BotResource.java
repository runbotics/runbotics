package com.runbotics.web.rest;

import com.runbotics.domain.User;
import com.runbotics.repository.BotRepository;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.BotQueryService;
import com.runbotics.service.BotService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.BotCriteria;
import com.runbotics.service.dto.BotDTO;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.runbotics.domain.Bot}.
 */
@RestController
@RequestMapping("/api")
public class BotResource {

    private final Logger log = LoggerFactory.getLogger(BotResource.class);

    private static final String ENTITY_NAME = "bot";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BotService botService;

    private final BotRepository botRepository;

    private final BotQueryService botQueryService;

    private final UserService userService;

    public BotResource(
        BotService botService,
        BotRepository botRepository,
        BotQueryService botQueryService,
        UserService userService
    ) {
        this.botService = botService;
        this.botRepository = botRepository;
        this.botQueryService = botQueryService;
        this.userService = userService;
    }

//    /**
//     * {@code GET  /bots} : get all the bots.
//     *
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bots in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_READ + "')")
//    @GetMapping("/bots")
//    public ResponseEntity<List<BotDTO>> getAllBots(BotCriteria criteria) {
//        log.debug("REST request to get Bots by criteria: {}", criteria);
//        List<BotDTO> bots = botQueryService.findByCriteria(criteria);
//        return ResponseEntity.ok().body(bots);
//    }
//
//    /**
//     * {@code GET  /bots-page} : get page of the bots.
//     *
//     * @param pageable the pagination information.
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bots in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_READ + "')")
//    @GetMapping("/bots-page")
//    public ResponseEntity<Page<BotDTO>> getAllBots(BotCriteria criteria, Pageable pageable) {
//        log.debug("REST request to get Bots by criteria: {}", criteria);
//        User requester = userService.getUserWithAuthorities().get();
//        boolean hasRequesterRoleAdmin = userService.hasAdminRole(requester);
//
//        Page<BotDTO> page = hasRequesterRoleAdmin
//            ? botQueryService.findByCriteria(criteria, pageable)
//            : botService.getBotPageForUser(criteria, pageable, requester);
//
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//        return ResponseEntity.ok().headers(headers).body(page);
//    }
//
//    /**
//     * {@code GET  /bots/count} : count all the bots.
//     *
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_READ + "')")
//    @GetMapping("/bots/count")
//    public ResponseEntity<Long> countBots(BotCriteria criteria) {
//        log.debug("REST request to count Bots by criteria: {}", criteria);
//        return ResponseEntity.ok().body(botQueryService.countByCriteria(criteria));
//    }
//
//    /**
//     * {@code GET  /bots/:id} : get the "id" bot.
//     *
//     * @param id the id of the botDTO to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the botDTO, or with status {@code 404 (Not Found)}.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_READ + "')")
//    @GetMapping("/bots/{id}")
//    public ResponseEntity<BotDTO> getBot(@PathVariable Long id) {
//        log.debug("REST request to get Bot : {}", id);
//        Optional<BotDTO> botDTO = botService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(botDTO);
//    }
}
