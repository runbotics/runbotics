package com.runbotics.web.rest;

import com.fasterxml.jackson.annotation.JsonView;
import com.runbotics.domain.User;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.ProcessQueryService;
import com.runbotics.service.ProcessService;
import com.runbotics.service.UserService;
import com.runbotics.service.criteria.ProcessCriteria;
import com.runbotics.service.dto.*;
import com.runbotics.service.exception.ProcessInstanceAccessDenied;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.runbotics.domain.Process}.
 */
@RestController
@RequestMapping("/api")
public class ProcessResource {

    private static final String ENTITY_NAME = "process";
    private final Logger log = LoggerFactory.getLogger(ProcessResource.class);
    private final ProcessService processService;
    private final ProcessRepository processRepository;
    private final ProcessQueryService processQueryService;
    private final UserService userService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ProcessResource(
        ProcessService processService,
        ProcessRepository processRepository,
        ProcessQueryService processQueryService,
        UserService userService
    ) {
        this.processService = processService;
        this.processRepository = processRepository;
        this.processQueryService = processQueryService;
        this.userService = userService;
    }

    /**
     * {@code POST  /processes} : Create a new process.
     *
     * @param processDTO the processDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new processDTO, or with status {@code 400 (Bad Request)} if the process has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_ADD + "')")
    @PostMapping("/processes")
    public ResponseEntity<ProcessDTO> createProcess(@Valid @RequestBody ProcessDTO processDTO) throws URISyntaxException {
        log.debug("REST request to save Process : {}", processDTO);
        boolean canBeCreated = processService.hasRequesterCreateProcessAccess();

        if (!canBeCreated) {
            throw new AccessDeniedException("Guest can create only one process");
        }

        if (processDTO.getId() != null) {
            throw new BadRequestAlertException("A new process cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProcessDTO result = processService.save(processDTO);

        return ResponseEntity
            .created(new URI("/api/processes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /processes/guest} : Create a new guest process.
     *
     * @return the {@link ResponseEntity} with status {@code 201 (Created)}
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_ADD + "')")
    @PostMapping("/processes/guest")
    public ResponseEntity<ProcessDTO> createGuestProcess() throws URISyntaxException {
        log.debug("REST request to create Guest Process");
        boolean canBeCreated = processService.hasRequesterCreateProcessAccess();

        if (!canBeCreated) {
            throw new AccessDeniedException("Guest can create only one process");
        }
        ProcessDTO result = processService.createGuestProcess();

        return ResponseEntity
            .created(new URI("/api/processes/guest" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /processes/:id} : Updates an existing process.
     *
     * @param id         the id of the processDTO to save.
     * @param processDTO the processDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated processDTO,
     * or with status {@code 400 (Bad Request)} if the processDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the processDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize(
        "@securityService.checkFeatureKeyAccess('" +
        FeatureKeyConstants.PROCESS_EDIT_INFO +
        "')" +
        "and (hasAuthority(\"" +
        AuthoritiesConstants.ADMIN +
        "\") or @securityService.isProcessOwner(#id))"
    )
    @PutMapping("/processes/{id}")
    public ResponseEntity<ProcessDTO> updateProcess(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProcessDTO processDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Process : {}, {}", id, processDTO);
        log.debug("ProcessCollection.id: {}", processDTO.getProcessCollection());
        if (processDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProcessDTO result = processService.save(processDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /processes/:id} : Partial updates given fields of an existing process, field will ignore if it is null
     *
     * @param id         the id of the processDTO to save.
     * @param processDTO the processDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated processDTO,
     * or with status {@code 400 (Bad Request)} if the processDTO is not valid,
     * or with status {@code 404 (Not Found)} if the processDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the processDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */

    @PatchMapping(value = "/processes/{id}")
    public ResponseEntity<ProcessDTO> partialUpdateProcess(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProcessDTO processDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Process partially : {}, {}", id, processDTO);
        checkProcessForEdit(id, processDTO);
        Optional<ProcessDTO> result = processService.partialUpdate(processDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_EDIT_STRUCTURE + "')")
    @PatchMapping(value = "/processes/{id}/diagram")
    public ResponseEntity<ProcessDTO> processSetDiagram(
        @PathVariable(value = "id", required = true) final Long id,
        @NotNull @RequestBody @Valid ProcessDiagramUpdateDTO processDiagramDTO
    ) {
        log.debug("REST request to update diagram in Process: {}", id);
        checkProcessForEdit(id, processDiagramDTO);

        ProcessDTO result = processService.updateDiagram(id, processDiagramDTO);

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_IS_ATTENDED_EDIT + "')")
    @PatchMapping(value = "/processes/{id}/is-attended")
    public ResponseEntity<ProcessDTO> processSetIsAttended(
        @PathVariable(value = "id", required = true) final Long id,
        @NotNull @RequestBody @Valid ProcessAttendedUpdateDTO processAttendedDTO
    ) throws URISyntaxException {
        log.debug("REST request to update is attended used in Process {} to {}", processAttendedDTO, processAttendedDTO.getIsAttended());
        checkProcessForEdit(id, processAttendedDTO);
        Optional<ProcessDTO> result = processService.updateIsAttended(processAttendedDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processAttendedDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_IS_TRIGGERABLE_EDIT + "')")
    @PatchMapping(value = "/processes/{id}/is-triggerable")
    public ResponseEntity<ProcessDTO> processSetIsTriggerable(
        @PathVariable(value = "id", required = true) final Long id,
        @NotNull @RequestBody @Valid ProcessTriggerUpdateDTO processDTO
    ) throws URISyntaxException {
        log.debug("REST request to update is triggerable used in Process {} to {}", processDTO, processDTO.getIsTriggerable());
        checkProcessForEdit(id, processDTO);
        Optional<ProcessDTO> result = processService.updateIsTriggerable(processDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_BOT_COLLECTION_EDIT + "')")
    @PatchMapping(value = "/processes/{id}/bot-collection")
    public ResponseEntity<ProcessDTO> processSetBotCollection(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProcessDTO processDTO
    ) throws URISyntaxException {
        log.debug("REST request to update bot collection used in Process {} to {}", processDTO, processDTO.getBotCollection());
        checkProcessForEdit(id, processDTO);
        Optional<ProcessDTO> result = processService.updateBotCollection(processDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_BOT_SYSTEM_EDIT + "')")
    @PatchMapping(value = "/processes/{id}/bot-system")
    public ResponseEntity<ProcessDTO> processSetBotSystem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProcessDTO processDTO
    ) throws URISyntaxException {
        log.debug("REST request to update bot system for the Process : {}, {}", id, processDTO);
        checkProcessForEdit(id, processDTO);
        Optional<ProcessDTO> result = processService.updateBotSystem(processDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processDTO.getId().toString())
        );
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_OUTPUT_TYPE_EDIT + "')")
    @PatchMapping(value = "/processes/{id}/output-type")
    public ResponseEntity<ProcessDTO> processSetOutputType(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody @Valid ProcessOutputTypeUpdateDTO processDTO
    ) throws URISyntaxException {
        log.debug("REST request to update is attended used in Process {} to {}", processDTO, processDTO.getOutputType());
        checkProcessForEdit(id, processDTO);
        Optional<ProcessDTO> result = processService.updateOutputType(processDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, processDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /processes} : get all the processes.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processes in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_LIST_READ + "')")
    @JsonView(ProcessDTOViews.DefaultView.class)
    @GetMapping("/processes")
    public ResponseEntity<List<ProcessDTO>> getAllProcesses(ProcessCriteria criteria) {
        log.debug("REST request to get Processes by criteria: {}", criteria);
        var requester = userService
            .getUserWithAuthorities()
            .orElseThrow(() -> new UsernameNotFoundException("Could not found current user with authorities in the database"));
        List<ProcessDTO> processes = processQueryService.findByCriteria(criteria);
        List<ProcessDTO> filteredProcesses = processQueryService.filterGuestProcessesByUserRole(
            processes,
            requester.getAuthorities().toString()
        );
        return ResponseEntity.ok().body(filteredProcesses);
    }

    /**
     * {@code GET  /processes-page} : get page of the processes.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processes in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_LIST_READ + "')")
    @GetMapping("/processes-page")
    public ResponseEntity<Page<ProcessDTO>> getAllProcessesByPage(ProcessCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Processes by criteria: {}", criteria);

        User requester = userService.getUserWithAuthorities().orElseThrow(ProcessInstanceAccessDenied::new);
        Page<ProcessDTO> page = processQueryService.findBySearchField(criteria, pageable, requester);
        HttpHeaders header = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(header).body(page);
    }

    /**
     * {@code GET  /processes-page-collection} : get page of the processes in collection.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processes in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_LIST_READ + "')")
    @GetMapping("/processes-page-collection")
    public ResponseEntity<Page<ProcessDTO>> getAllProcessesByPageInCollection(ProcessCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Processes by criteria: {}", criteria);

        User requester = userService.getUserWithAuthorities().orElseThrow(ProcessInstanceAccessDenied::new);
        Page<ProcessDTO> page = processQueryService.findBySearchFieldAndCollection(criteria, pageable, requester);
        HttpHeaders header = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(header).body(page);
    }

    /**
     * {@code GET  /processes/count} : count all the processes.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_LIST_READ + "')")
    @GetMapping("/processes/count")
    public ResponseEntity<Long> countProcesses(ProcessCriteria criteria) {
        log.debug("REST request to count Processes by criteria: {}", criteria);
        return ResponseEntity.ok().body(processQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /processes/:id} : get the "id" process.
     *
     * @param id the id of the processDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the processDTO, or with status {@code 404 (Not Found)}.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_READ + "')")
    @GetMapping("/processes/{id}")
    public ResponseEntity<ProcessDTO> getProcess(@PathVariable Long id) {
        log.debug("REST request to get Process : {}", id);
        Optional<ProcessDTO> processDTO = processService.findOne(id);
        return ResponseUtil.wrapOrNotFound(processDTO);
    }

    /**
     * {@code DELETE  /processes/:id} : delete the "id" process.
     *
     * @param id the id of the processDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @PreAuthorize(
        "@securityService.checkFeatureKeyAccess('" +
        FeatureKeyConstants.PROCESS_DELETE +
        "')" +
        "and (hasAuthority(\"" +
        AuthoritiesConstants.ADMIN +
        "\") or @securityService.isProcessOwner(#id))"
    )
    @DeleteMapping("/processes/{id}")
    public ResponseEntity<Void> deleteProcess(@PathVariable Long id) {
        log.debug("REST request to delete Process : {}", id);
        processService.delete(id);
        processService.deleteProcessLeftovers();
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    private void checkProcessForEdit(long id, ProcessDTO processDTO) throws BadRequestAlertException {
        if (processDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
    }

    private void checkProcessForEdit(long id, ProcessDiagramUpdateDTO processDiagramDTO) throws BadRequestAlertException {
        if (processDiagramDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processDiagramDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
    }

    private void checkProcessForEdit(long id, ProcessAttendedUpdateDTO processAttendedDTO) throws BadRequestAlertException {
        if (processAttendedDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processAttendedDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
    }

    private void checkProcessForEdit(long id, ProcessTriggerUpdateDTO processTriggerDTO) throws BadRequestAlertException {
        if (processTriggerDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processTriggerDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
    }

    private void checkProcessForEdit(long id, ProcessOutputTypeUpdateDTO processOutputTypeUpdateDTO) throws BadRequestAlertException {
        if (processOutputTypeUpdateDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if (!Objects.equals(id, processOutputTypeUpdateDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!processRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
    }
}
