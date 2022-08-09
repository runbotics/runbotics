package com.runbotics.web.rest;

import com.runbotics.repository.ActionRepository;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.ActionQueryService;
import com.runbotics.service.ActionService;
import com.runbotics.service.criteria.ActionCriteria;
import com.runbotics.service.dto.ActionDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.runbotics.domain.Action}.
 */
@RestController
@RequestMapping("/api")
public class ActionResource {

    private final Logger log = LoggerFactory.getLogger(ActionResource.class);

    private static final String ENTITY_NAME = "action";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActionService actionService;

    private final ActionRepository actionRepository;

    private final ActionQueryService actionQueryService;

    public ActionResource(ActionService actionService, ActionRepository actionRepository, ActionQueryService actionQueryService) {
        this.actionService = actionService;
        this.actionRepository = actionRepository;
        this.actionQueryService = actionQueryService;
    }

    /**
     * {@code POST  /actions} : Create a new action.
     *
     * @param actionDTO the actionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new actionDTO, or with status {@code 400 (Bad Request)} if the action has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_ADD + "')")
    @PostMapping("/actions")
    public ResponseEntity<ActionDTO> createAction(@RequestBody ActionDTO actionDTO) throws URISyntaxException {
        log.debug("REST request to save Action : {}", actionDTO);
        //        if (actionDTO.getId() != null) {
        //            throw new BadRequestAlertException("A new action cannot already have an ID", ENTITY_NAME, "idexists");
        //        }
        ActionDTO result = actionService.save(actionDTO);
        return ResponseEntity
            .created(new URI("/api/actions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /actions/:id} : Updates an existing action.
     *
     * @param id the id of the actionDTO to save.
     * @param actionDTO the actionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionDTO,
     * or with status {@code 400 (Bad Request)} if the actionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the actionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_EDIT + "')")
    @PutMapping("/actions/{id}")
    public ResponseEntity<ActionDTO> updateAction(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ActionDTO actionDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Action : {}, {}", id, actionDTO);
        if (actionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActionDTO result = actionService.save(actionDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actionDTO.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /actions/:id} : Partial updates given fields of an existing action, field will ignore if it is null
     *
     * @param id the id of the actionDTO to save.
     * @param actionDTO the actionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated actionDTO,
     * or with status {@code 400 (Bad Request)} if the actionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the actionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the actionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_EDIT + "')")
    @PatchMapping(value = "/actions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ActionDTO> partialUpdateAction(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ActionDTO actionDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Action partially : {}, {}", id, actionDTO);
        if (actionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, actionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!actionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActionDTO> result = actionService.partialUpdate(actionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, actionDTO.getId())
        );
    }

    /**
     * {@code GET  /actions} : get all the actions.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of actions in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_READ + "')")
    @GetMapping("/actions")
    public ResponseEntity<List<ActionDTO>> getAllActions(ActionCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Actions by criteria: {}", criteria);
        Page<ActionDTO> page = actionQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /actions/count} : count all the actions.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_READ + "')")
    @GetMapping("/actions/count")
    public ResponseEntity<Long> countActions(ActionCriteria criteria) {
        log.debug("REST request to count Actions by criteria: {}", criteria);
        return ResponseEntity.ok().body(actionQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /actions/:id} : get the "id" action.
     *
     * @param id the id of the actionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the actionDTO, or with status {@code 404 (Not Found)}.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_READ + "')")
    @GetMapping("/actions/{id}")
    public ResponseEntity<ActionDTO> getAction(@PathVariable String id) {
        log.debug("REST request to get Action : {}", id);
        Optional<ActionDTO> actionDTO = actionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(actionDTO);
    }

    /**
     * {@code DELETE  /actions/:id} : delete the "id" action.
     *
     * @param id the id of the actionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.EXTERNAL_ACTION_DELETE + "')")
    @DeleteMapping("/actions/{id}")
    public ResponseEntity<Void> deleteAction(@PathVariable String id) {
        log.debug("REST request to delete Action : {}", id);
        actionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
