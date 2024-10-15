package com.runbotics.web.rest;

import com.runbotics.domain.BotCollectionConstants;
import com.runbotics.domain.User;
import com.runbotics.repository.BotCollectionRepository;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.BotCollectionQueryService;
import com.runbotics.service.BotCollectionService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.BotCollectionCriteria;
import com.runbotics.service.dto.BotCollectionDTO;
import com.runbotics.service.exception.CollectionAccessDenied;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Stream;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api")
public class BotCollectionResource {

    private final Logger log = LoggerFactory.getLogger(BotCollectionResource.class);

    private static final String ENTITY_NAME = "bot-collection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;
    private final BotCollectionService botCollectionService;
    private final BotCollectionRepository botCollectionRepository;
    private final BotCollectionQueryService botCollectionQueryService;

    public BotCollectionResource(
        UserService userService, BotCollectionService botCollectionService,
        BotCollectionRepository botCollectionRepository,
        BotCollectionQueryService botCollectionQueryService
    ) {
        this.userService = userService;
        this.botCollectionService = botCollectionService;
        this.botCollectionRepository = botCollectionRepository;
        this.botCollectionQueryService = botCollectionQueryService;
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_ADD + "')")
    @PostMapping("bot-collection")
    public ResponseEntity<BotCollectionDTO> createBotCollection(@Valid @RequestBody BotCollectionDTO botCollectionDTO)
        throws URISyntaxException {
        log.debug("REST request to save BotCollection : {}", botCollectionDTO);

        if(botCollectionRepository.getBotCollectionByName(botCollectionDTO.getName())!=null){
            throw new BadRequestAlertException("A new bot collection name already taken", ENTITY_NAME, "nameexists");
        }

        if(botCollectionDTO.getName().trim().length() == 0){
            throw new BadRequestAlertException("A new bot collection cannot have blank name", ENTITY_NAME, "noname");
        }

        if (botCollectionDTO.getId() != null) {
            throw new BadRequestAlertException("A new bot collection cannot already have an ID", ENTITY_NAME, "idexists");
        }



        BotCollectionDTO result = botCollectionService.save(botCollectionDTO);
        return ResponseEntity
            .created(new URI("/api/bot-collection/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_EDIT + "')")
    @PutMapping("bot-collection/{id}")
    public ResponseEntity<BotCollectionDTO> updateBotCollection(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody BotCollectionDTO botCollectionDTO
    ) {
        log.debug("REST request to update BotCollection : {}, {}", id, botCollectionDTO);
        if (botCollectionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, botCollectionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!botCollectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }



        BotCollectionDTO result = botCollectionService.save(botCollectionDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, botCollectionDTO.getId().toString()))
            .body(result);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_EDIT + "')")
    @PatchMapping(value = "bot-collection/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<BotCollectionDTO> partialUpdateBotCollection(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody BotCollectionDTO botCollectionDTO
    ) {
        log.debug("REST request to partial update BotCollection partially : {}, {}", id, botCollectionDTO);

        if(isPublicOrGuest(id)){
            throw new BadRequestAlertException("Can not delete this collection", ENTITY_NAME, "cantedit");
        }

        if (botCollectionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, botCollectionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!botCollectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BotCollectionDTO> result = botCollectionService.partialUpdate(botCollectionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, botCollectionDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_READ + "')")
    @GetMapping("bot-collection")
    public ResponseEntity<List<BotCollectionDTO>> getAllBotCollections(BotCollectionCriteria criteria) {
        log.debug("REST request to get BotCollections by criteria: {}", criteria);
        List<BotCollectionDTO> bots = botCollectionQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(bots);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_READ + "')")
    @GetMapping("bot-collection-page")
    public ResponseEntity<List<BotCollectionDTO>> getAllBotCollections(BotCollectionCriteria criteria, Pageable pageable) {
        log.debug("REST request to get BotCollections by criteria: {}", criteria);
        Page<BotCollectionDTO> page = botCollectionQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_READ + "')")
    @GetMapping("bot-collection/count")
    public ResponseEntity<Long> countBotCollectionss(BotCollectionCriteria criteria) {
        log.debug("REST request to count BotCollections by criteria: {}", criteria);
        return ResponseEntity.ok().body(botCollectionQueryService.countByCriteria(criteria));
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_READ + "')")
    @GetMapping("bot-collection/{id}")
    public ResponseEntity<BotCollectionDTO> getBotCollection(@PathVariable UUID id) {
        log.debug("REST request to get BotCollection : {}", id);
        Optional<BotCollectionDTO> botDTO = botCollectionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(botDTO);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_DELETE + "')")
    @DeleteMapping("bot-collection/{id}")
    public ResponseEntity<Void> deleteBotCollection(@PathVariable UUID id) {
        log.debug("REST request to delete BotCollection : {}", id);

        if(isPublicOrGuest(id)){
            log.debug("Can not delete collection with id: {}", id);
            throw new CollectionAccessDenied("You can't delete this collection");
        }

        botCollectionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("bot-collection/current-user")
    public ResponseEntity<List<BotCollectionDTO>> getBotCollectionsForCurrentUser() {
        User currentUser = userService.getUserWithAuthorities().get();
        log.debug("REST request to get all collections for user : {}", currentUser.getEmail());
        boolean hasRequesterRoleAdmin = userService.hasAdminRole(currentUser);

        List<BotCollectionDTO> botCollection = hasRequesterRoleAdmin
            ? botCollectionService.findAll()
            : botCollectionService.getAllForUser(currentUser);

        return ResponseEntity.ok().body(botCollection);
    }

    @GetMapping("bot-collection-page/current-user")
    public ResponseEntity<Page<BotCollectionDTO>> getBotCollectionsPageForCurrentUser(Pageable pageable, BotCollectionCriteria criteria) {
        User currentUser = userService.getUserWithAuthorities().get();
        log.debug("REST request to get page collections for user : {}", currentUser.getEmail());
        boolean hasRequesterRoleAdmin = userService.hasAdminRole(currentUser);

        Page<BotCollectionDTO> page = hasRequesterRoleAdmin
            ? botCollectionQueryService.findByCriteria(criteria, pageable)
            : botCollectionService.getPageForUser(criteria, pageable, currentUser);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    boolean isPublicOrGuest(UUID id){
        return Stream.of(BotCollectionConstants.PUBLIC_COLLECTION,BotCollectionConstants.GUEST_COLLECTION)
            .map(botCollectionRepository::getBotCollectionByName)
            .anyMatch(botCollection -> botCollection.getId().equals(id));
    }
}
