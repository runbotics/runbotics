//package com.runbotics.web.rest;
//
//import com.runbotics.repository.ProcessInstanceRepository;
//import com.runbotics.security.FeatureKeyConstants;
//import com.runbotics.service.ProcessInstanceQueryService;
//import com.runbotics.service.ProcessInstanceService;
//import com.runbotics.service.criteria.ProcessInstanceCriteria;
//import com.runbotics.service.dto.ProcessInstanceDTO;
//import com.runbotics.service.dto.ProcessDTO;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
//import tech.jhipster.web.util.PaginationUtil;
//import tech.jhipster.web.util.ResponseUtil;
//
///**
// * REST controller for managing {@link com.runbotics.domain.ProcessInstance}.
// */
//@RestController
//@RequestMapping("/api")
//public class ProcessInstanceResource {
//
//    private final Logger log = LoggerFactory.getLogger(ProcessInstanceResource.class);
//
//    private static final String ENTITY_NAME = "processInstance";
//
//    @Value("${jhipster.clientApp.name}")
//    private String applicationName;
//
//    private final ProcessInstanceService processInstanceService;
//
//    private final ProcessInstanceRepository processInstanceRepository;
//
//    private final ProcessInstanceQueryService processInstanceQueryService;
//
//    public ProcessInstanceResource(
//        ProcessInstanceService processInstanceService,
//        ProcessInstanceRepository processInstanceRepository,
//        ProcessInstanceQueryService processInstanceQueryService
//    ) {
//        this.processInstanceService = processInstanceService;
//        this.processInstanceRepository = processInstanceRepository;
//        this.processInstanceQueryService = processInstanceQueryService;
//    }
//
//    /**
//     * {@code GET  /process-instances} : get all the processInstances.
//     *
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processInstances in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_READ + "')")
//    @GetMapping("/process-instances")
//    public ResponseEntity<List<ProcessInstanceDTO>> getAllProcessInstances(ProcessInstanceCriteria criteria) {
//        log.debug("REST request to get ProcessInstances by criteria: {}", criteria);
//        List<ProcessInstanceDTO> list = processInstanceQueryService.findByCriteria(criteria);
//        return ResponseEntity.ok().body(list);
//    }
//
//    /**
//     * {@code GET  /process-instances-page} : get processInstances page.
//     *
//     * @param pageable the pagination information.
//     * @param criteria the criteria which the requested entities should match.
//     * @param instanceId the optional param with id of searched for process instance in a page.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processInstances in body. If instanceId is present processInstances returned contain specific instance.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_READ + "')")
//    @GetMapping("/process-instances-page")
//    public ResponseEntity<Page<ProcessInstanceDTO>> getProcessInstancesPage(
//        ProcessInstanceCriteria criteria,
//        Pageable pageable,
//        @RequestParam Optional<UUID> instanceId
//    ) {
//        log.debug("REST request to get ProcessInstances page by criteria: {}", criteria);
//        Page<ProcessInstanceDTO> page =
//            (
//                instanceId.isPresent()
//                    ? processInstanceQueryService.findByCriteriaWithSpecificInstance(instanceId.get(), criteria, pageable)
//                    : processInstanceQueryService.findByCriteria(criteria, pageable)
//            );
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//        return ResponseEntity.ok().headers(headers).body(page);
//    }
//
//    /**
//     * {@code GET  /process-instances/count} : count all the processInstances.
//     *
//     * @param criteria the criteria which the requested entities should match.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_READ + "')")
//    @GetMapping("/process-instances/count")
//    public ResponseEntity<Long> countProcessInstances(ProcessInstanceCriteria criteria) {
//        log.debug("REST request to count ProcessInstances by criteria: {}", criteria);
//        return ResponseEntity.ok().body(processInstanceQueryService.countByCriteria(criteria));
//    }
//
//    /**
//     * {@code GET  /process-instances/:id} : get the "id" processInstance.
//     *
//     * @param id the id of the processInstanceDTO to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the processInstanceDTO, or with status {@code 404 (Not Found)}.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_READ + "')")
//    @GetMapping("/process-instances/{id}")
//    public ResponseEntity<ProcessInstanceDTO> getProcessInstance(@PathVariable UUID id) {
//        log.debug("REST request to get ProcessInstance : {}", id);
//        Optional<ProcessInstanceDTO> processInstanceDTO = processInstanceService.findOne(id);
//        return ResponseUtil.wrapOrNotFound(processInstanceDTO);
//    }
//
//    /**
//     * {@code GET /process-instances/{id}/subprocesses} : get all subprocesses for the processInstance of a particular ID by page.
//     *
//     * @param id the ID of the processInstance.
//     * @param page the page number
//     * @param size the size of the page (how many instances fit one page)
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the page of subprocesses in the body,
//     *         or with status {@code 404 (Not Found)} if the processInstance does not exist.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_READ + "')")
//    @GetMapping("/process-instances/{id}/subprocesses")
//    public ResponseEntity<Page<ProcessInstanceDTO>> getProcessInstanceSubprocesses(
//        @PathVariable UUID id,
//        Pageable pageable
//    ) {
//        log.debug("REST request to get subprocesses for ProcessInstance: {}", id);
//        Optional<ProcessInstanceDTO> processInstanceDTO = processInstanceService.findOne(id);
//        if (processInstanceDTO.isEmpty()) return ResponseEntity.notFound().build();
//
//        Page<ProcessInstanceDTO> subprocessesPage = processInstanceService.findSubprocesses(id, pageable);
//
//        return ResponseEntity.ok().body(subprocessesPage);
//    }
//}
