package com.runbotics.web.rest;

import com.runbotics.domain.Authority;
import com.runbotics.domain.User;
import com.runbotics.repository.GlobalVariableRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.GlobalVariableQueryService;
import com.runbotics.service.GlobalVariableService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.GlobalVariableCriteria;
import com.runbotics.service.dto.GlobalVariableDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.runbotics.domain.GlobalVariable}.
 */
@RestController
@RequestMapping("/api")
public class GlobalVariableResource {

    private final Logger log = LoggerFactory.getLogger(GlobalVariableResource.class);

    private static final String ENTITY_NAME = "globalVariable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GlobalVariableService globalVariableService;

    private final GlobalVariableRepository globalVariableRepository;

    private final GlobalVariableQueryService globalVariableQueryService;

    private final UserService userService;

    public GlobalVariableResource(
        GlobalVariableService globalVariableService,
        GlobalVariableRepository globalVariableRepository,
        GlobalVariableQueryService globalVariableQueryService,
        UserService userService
    ) {
        this.globalVariableService = globalVariableService;
        this.globalVariableRepository = globalVariableRepository;
        this.globalVariableQueryService = globalVariableQueryService;
        this.userService = userService;
    }

    /**
     * {@code POST  /global-variables} : Create a new globalVariable.
     *
     * @param globalVariableDTO the globalVariableDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new globalVariableDTO, or with status {@code 400 (Bad Request)} if the globalVariable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_ADD + "')")
    @PostMapping("/global-variables")
    public ResponseEntity<GlobalVariableDTO> createGlobalVariable(@RequestBody GlobalVariableDTO globalVariableDTO)
        throws URISyntaxException {
        log.debug("REST request to save GlobalVariable : {}", globalVariableDTO);
        GlobalVariableDTO result = globalVariableService.save(globalVariableDTO);
        return ResponseEntity
            .created(new URI("/api/global-variables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /global-variables/:id} : Updates an existing globalVariable.
     *
     * @param id the id of the globalVariableDTO to save.
     * @param globalVariableDTO the globalVariableDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalVariableDTO,
     * or with status {@code 400 (Bad Request)} if the globalVariableDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the globalVariableDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize(
        "@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_EDIT + "')" +
        "and (hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\") or @securityService.isGlobalVariableOwner(#id))"
    )
    @PutMapping("/global-variables/{id}")
    public ResponseEntity<GlobalVariableDTO> updateGlobalVariable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GlobalVariableDTO globalVariableDTO
    ) throws URISyntaxException {
        log.debug("REST request to update GlobalVariable : {}, {}", id, globalVariableDTO);
        if (globalVariableDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalVariableDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalVariableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GlobalVariableDTO result = globalVariableService.save(globalVariableDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, globalVariableDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /global-variables/:id} : Partial updates given fields of an existing globalVariable, field will ignore if it is null
     *
     * @param id the id of the globalVariableDTO to save.
     * @param globalVariableDTO the globalVariableDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated globalVariableDTO,
     * or with status {@code 400 (Bad Request)} if the globalVariableDTO is not valid,
     * or with status {@code 404 (Not Found)} if the globalVariableDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the globalVariableDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_EDIT + "')")
    @PatchMapping(value = "/global-variables/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<GlobalVariableDTO> partialUpdateGlobalVariable(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GlobalVariableDTO globalVariableDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update GlobalVariable partially : {}, {}", id, globalVariableDTO);
        if (globalVariableDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, globalVariableDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!globalVariableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GlobalVariableDTO> result = globalVariableService.partialUpdate(globalVariableDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, globalVariableDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /global-variables} : get all the globalVariables.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of globalVariables in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_READ + "')")
    @GetMapping("/global-variables")
    public ResponseEntity<List<GlobalVariableDTO>> getAllGlobalVariables(GlobalVariableCriteria criteria, Pageable pageable) {
        log.debug("REST request to get GlobalVariables by criteria: {}", criteria);
        User requester = userService.getUserWithAuthorities().get();
        Authority adminAuthority = new Authority();
        adminAuthority.setName(AuthoritiesConstants.ADMIN);
        boolean hasRequesterRoleAdmin = requester.getAuthorities().contains(adminAuthority);

        Page<GlobalVariableDTO> page = hasRequesterRoleAdmin
            ? globalVariableQueryService.findByCriteria(criteria, pageable)
            : globalVariableService.getByRequester(pageable, requester.getId());

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /global-variables/count} : count all the globalVariables.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_READ + "')")
    @GetMapping("/global-variables/count")
    public ResponseEntity<Long> countGlobalVariables(GlobalVariableCriteria criteria) {
        log.debug("REST request to count GlobalVariables by criteria: {}", criteria);
        return ResponseEntity.ok().body(globalVariableQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /global-variables/:id} : get the "id" globalVariable.
     *
     * @param id the id of the globalVariableDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the globalVariableDTO, or with status {@code 404 (Not Found)}.
     */
    @PreAuthorize(
        "@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_READ + "')" +
        "and (hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\") or @securityService.isGlobalVariableOwner(#id))"
    )
    @GetMapping("/global-variables/{id}")
    public ResponseEntity<GlobalVariableDTO> getGlobalVariable(@PathVariable Long id) {
        log.debug("REST request to get GlobalVariable : {}", id);
        Optional<GlobalVariableDTO> globalVariableDTO = globalVariableService.findOne(id);
        return ResponseUtil.wrapOrNotFound(globalVariableDTO);
    }

    /**
     * {@code DELETE  /global-variables/:id} : delete the "id" globalVariable. GlobalVariable couldn't be associated with any Process.
     *
     * @param id the id of the globalVariableDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize(
        "@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.GLOBAL_VARIABLE_DELETE + "')" +
        "and (hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\") or @securityService.isGlobalVariableOwner(#id))"
    )
    @DeleteMapping("/global-variables/{id}")
    public ResponseEntity<List<String>> deleteGlobalVariable(@PathVariable Long id) {
        log.debug("REST request to delete GlobalVariable : {}", id);
        List<String> associatedProcesses = globalVariableService.getProcessNamesAssociatedWithGlobalVariable(id);
        if (associatedProcesses.isEmpty()) {
            globalVariableService.delete(id);
            return ResponseEntity
                .noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
        }
        return ResponseEntity
            .badRequest()
            .body(associatedProcesses);
    }
}
