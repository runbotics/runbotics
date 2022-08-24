package com.runbotics.web.rest;

import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.ScheduleProcessQueryService;
import com.runbotics.service.ScheduleProcessService;
import com.runbotics.service.criteria.ScheduleProcessCriteria;
import com.runbotics.service.dto.ScheduleProcessDTO;
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
 * REST controller for managing {@link com.runbotics.domain.ScheduleProcess}.
 */
@RestController
@RequestMapping("/api")
public class ScheduleProcessResource {

    private final Logger log = LoggerFactory.getLogger(ScheduleProcessResource.class);

    private final ScheduleProcessService scheduleProcessService;

    private final ScheduleProcessQueryService scheduleProcessQueryService;

    public ScheduleProcessResource(ScheduleProcessService scheduleProcessService, ScheduleProcessQueryService scheduleProcessQueryService) {
        this.scheduleProcessService = scheduleProcessService;
        this.scheduleProcessQueryService = scheduleProcessQueryService;
    }

    /**
     * {@code GET  /schedule-processes} : get all the scheduleProcesses.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of scheduleProcesses in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.SCHEDULE_READ + "')")
    @GetMapping("/schedule-processes")
    public ResponseEntity<List<ScheduleProcessDTO>> getAllScheduleProcesses(ScheduleProcessCriteria criteria, Pageable pageable) {
        log.debug("REST request to get ScheduleProcesses by criteria: {}", criteria);
        Page<ScheduleProcessDTO> page = scheduleProcessQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /schedule-processes/count} : count all the scheduleProcesses.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.SCHEDULE_READ + "')")
    @GetMapping("/schedule-processes/count")
    public ResponseEntity<Long> countScheduleProcesses(ScheduleProcessCriteria criteria) {
        log.debug("REST request to count ScheduleProcesses by criteria: {}", criteria);
        return ResponseEntity.ok().body(scheduleProcessQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /schedule-processes/:id} : get the "id" scheduleProcess.
     *
     * @param id the id of the scheduleProcessDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the scheduleProcessDTO, or with status {@code 404 (Not Found)}.
     */
    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.SCHEDULE_READ + "')")
    @GetMapping("/schedule-processes/{id}")
    public ResponseEntity<ScheduleProcessDTO> getScheduleProcess(@PathVariable Long id) {
        log.debug("REST request to get ScheduleProcess : {}", id);
        Optional<ScheduleProcessDTO> scheduleProcessDTO = scheduleProcessService.findOne(id);
        return ResponseUtil.wrapOrNotFound(scheduleProcessDTO);
    }
}
