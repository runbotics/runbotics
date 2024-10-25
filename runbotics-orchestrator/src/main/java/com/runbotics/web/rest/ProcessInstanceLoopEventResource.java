//package com.runbotics.web.rest;
//
//import com.runbotics.domain.ProcessInstanceLoopEvent;
//import com.runbotics.repository.ProcessInstanceLoopEventRepository;
//import com.runbotics.security.FeatureKeyConstants;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
///**
// * REST controller for managing {@link com.runbotics.domain.ProcessInstanceLoopEvent}.
// */
//@RestController
//@RequestMapping("/api")
//public class ProcessInstanceLoopEventResource {
//
//    private final Logger log = LoggerFactory.getLogger(ProcessInstanceLoopEventResource.class);
//
//    private static final String ENTITY_NAME = "processInstanceLoopEvent";
//
//    @Autowired
//    private ProcessInstanceLoopEventRepository loopEventRepository;
//
//
//    @Value("${jhipster.clientApp.name}")
//    private String applicationName;
//    /**
//     * {@code GET  /process-instance-loop-events/{loopId} : get all the processInstanceLoopEvents this loopId.
//     *
//     * @param loopId the id of the processInstanceLoopEvents to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the list processInstanceLoopEvents,
//     * or with status {@code 404 (Not Found)}.
//     */
//    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_INSTANCE_EVENT_READ + "')")
//    @GetMapping("/process-instance-loop-events/{loopId}")
//        public ResponseEntity<List<ProcessInstanceLoopEvent>> getLoopEvents(@PathVariable String loopId) {
//        log.debug("REST request to get ProcessInstanceLoopEvents : {}", loopId);
//            List<ProcessInstanceLoopEvent> loopEvents = loopEventRepository.findByLoopId(loopId);
//            return ResponseEntity.ok().body(loopEvents);
//        }
//}
