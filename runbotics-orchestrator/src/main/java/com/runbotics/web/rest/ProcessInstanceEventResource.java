//package com.runbotics.web.rest;
//
//import com.runbotics.repository.ProcessInstanceEventRepository;
//import com.runbotics.security.FeatureKeyConstants;
//import com.runbotics.service.ProcessInstanceEventQueryService;
//import com.runbotics.service.ProcessInstanceEventService;
//import com.runbotics.service.criteria.ProcessInstanceEventCriteria;
//import com.runbotics.service.dto.ProcessInstanceEventDTO;
//import com.runbotics.web.rest.errors.BadRequestAlertException;
//import java.net.URI;
//import java.net.URISyntaxException;
//import java.util.List;
//import java.util.Objects;
//import java.util.Optional;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
//import tech.jhipster.web.util.HeaderUtil;
//import tech.jhipster.web.util.PaginationUtil;
//import tech.jhipster.web.util.ResponseUtil;
//
///**
// * REST controller for managing {@link com.runbotics.domain.ProcessInstanceEvent}.
// */
//@RestController
//@RequestMapping("/api")
//public class ProcessInstanceEventResource {
//
//    private final Logger log = LoggerFactory.getLogger(ProcessInstanceEventResource.class);
//
//    private static final String ENTITY_NAME = "processInstanceEvent";
//
//    @Value("${jhipster.clientApp.name}")
//    private String applicationName;
//
//    private final ProcessInstanceEventService processInstanceEventService;
//
//    private final ProcessInstanceEventRepository processInstanceEventRepository;
//
//    private final ProcessInstanceEventQueryService processInstanceEventQueryService;
//
//    public ProcessInstanceEventResource(
//        ProcessInstanceEventService processInstanceEventService,
//        ProcessInstanceEventRepository processInstanceEventRepository,
//        ProcessInstanceEventQueryService processInstanceEventQueryService
//    ) {
//        this.processInstanceEventService = processInstanceEventService;
//        this.processInstanceEventRepository = processInstanceEventRepository;
//        this.processInstanceEventQueryService = processInstanceEventQueryService;
//    }
//
//    /**
//     * {@code GET  /process-instance-events} : get all the processInstanceEvents.
//     *
//     * @param pageable the pagination information.
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processInstanceEvents in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_EVENT_READ + "')")
//    @GetMapping("/process-instance-events")
//    public ResponseEntity<List<ProcessInstanceEventDTO>> getAllProcessInstanceEvents(
//        ProcessInstanceEventCriteria criteria,
//        Pageable pageable
//    ) {
//        log.debug("REST request to get ProcessInstanceEvents by criteria: {}", criteria);
//        Page<ProcessInstanceEventDTO> page = processInstanceEventQueryService.findByCriteria(criteria, pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//        return ResponseEntity.ok().headers(headers).body(page.getContent());
//    }
//
//    /**
//     * {@code GET  /process-instance-events/count} : count all the processInstanceEvents.
//     *
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_EVENT_READ + "')")
//    @GetMapping("/process-instance-events/count")
//    public ResponseEntity<Long> countProcessInstanceEvents(ProcessInstanceEventCriteria criteria) {
//        log.debug("REST request to count ProcessInstanceEvents by criteria: {}", criteria);
//        return ResponseEntity.ok().body(processInstanceEventQueryService.countByCriteria(criteria));
//    }
//
//    /**
//     * {@code GET  /process-instance-events/:id} : get the "id" processInstanceEvent.
//     *
//     * @param id the id of the processInstanceEventDTO to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the processInstanceEventDTO, or with status {@code 404 (Not Found)}.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_EVENT_READ + "')")
//    @GetMapping("/process-instance-events/{id}")
//    public ResponseEntity<ProcessInstanceEventDTO> getProcessInstanceEvent(@PathVariable Long id) {
//        log.debug("REST request to get ProcessInstanceEvent : {}", id);
//        Optional<ProcessInstanceEventDTO> processInstanceEventDTO = processInstanceEventService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(processInstanceEventDTO);
//    }
//}
