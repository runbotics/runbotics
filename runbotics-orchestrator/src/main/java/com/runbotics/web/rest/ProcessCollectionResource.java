package com.runbotics.web.rest;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.repository.ProcessCollectionRepository;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.ProcessCollectionQueryService;
import com.runbotics.service.ProcessCollectionService;
import com.runbotics.service.dto.ProcessCollectionDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProcessCollectionResource {

    private final Logger log = LoggerFactory.getLogger(ProcessCollectionResource.class);

    private static final String ENTITY_NAME = "process-collection";

    private final ProcessCollectionService processCollectionService;
    private final ProcessCollectionQueryService processCollectionQueryService;

    private final ProcessCollectionRepository processCollectionRepository;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ProcessCollectionResource(
        ProcessCollectionService processCollectionService,
        ProcessCollectionQueryService processCollectionQueryService,
        ProcessCollectionRepository processCollectionRepository
    ) {
        this.processCollectionService = processCollectionService;
        this.processCollectionRepository = processCollectionRepository;
        this.processCollectionQueryService = processCollectionQueryService;
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.BOT_COLLECTION_ADD + "')")
    @PostMapping("process-collection")
    public ResponseEntity<ProcessCollectionDTO> createProcessCollection(@Valid @RequestBody ProcessCollectionDTO processCollectionDTO)
        throws URISyntaxException {
        log.debug("REST request to save ProcessCollection : {}", processCollectionDTO);
        List<String> currentCollectionChildrenNames;

        currentCollectionChildrenNames =
            processCollectionDTO.getParentId() == null
                ? processCollectionRepository.findAllRootCollectionNames()
                : processCollectionRepository.findAllChildrenCollectionNames(processCollectionDTO.getParentId());

        if(processCollectionDTO.getName().trim().length() == 0){
            throw new BadRequestAlertException("A new process collection cannot have blank name", ENTITY_NAME, "noname");
        }

        if (
            currentCollectionChildrenNames.contains(processCollectionDTO.getName())
        ) {
            throw new BadRequestAlertException("There's already a collection with this name in that directory", ENTITY_NAME, "nameexists");
        }

        if (processCollectionDTO.getId() != null) {
            throw new BadRequestAlertException("A new process collection cannot already have an ID", ENTITY_NAME, "idexists");
        }

        ProcessCollectionDTO result = processCollectionService.save(processCollectionDTO);
        return ResponseEntity
            .created(new URI("/api/process-collection/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

}
