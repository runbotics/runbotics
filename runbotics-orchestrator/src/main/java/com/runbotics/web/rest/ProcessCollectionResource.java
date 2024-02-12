package com.runbotics.web.rest;

import com.runbotics.domain.ProcessCollection;
import com.runbotics.repository.ProcessCollectionRepository;
import com.runbotics.security.FeatureKeyConstants;
import com.runbotics.service.ProcessCollectionQueryService;
import com.runbotics.service.ProcessCollectionService;
import com.runbotics.service.criteria.ProcessCollectionCriteria;
import com.runbotics.service.dto.ProcessCollectionDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import javax.annotation.Nullable;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

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

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_COLLECTION_READ + "')")
    @GetMapping("process-collection")
    public ResponseEntity<List<ProcessCollectionDTO>> getAllCollections(ProcessCollectionCriteria criteria) {
        List<ProcessCollectionDTO> collections = processCollectionService.getCollectionsByCriteria(criteria);

        if (collections.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(collections);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_COLLECTION_READ + "')")
    @GetMapping("process-collection-path")
    public ResponseEntity<List<ProcessCollectionDTO>> getCollectionHierarchy(@RequestParam @Nullable UUID collectionId) {
        List<ProcessCollectionDTO> result = processCollectionService.getCollectionsByParentHierarchy(collectionId);
        return ResponseEntity.ok().body(result);
    }

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_COLLECTION_ADD + "')")
    @PostMapping("process-collection")
    public ResponseEntity<ProcessCollectionDTO> createProcessCollection(@Valid @RequestBody ProcessCollectionDTO processCollectionDTO)
        throws URISyntaxException {
        log.debug("REST request to save ProcessCollection : {}", processCollectionDTO);

        UUID parentId = processCollectionDTO.getParentId();
        String name = processCollectionDTO.getName();
        boolean isNameAvailable = parentId != null
            ? processCollectionRepository.findSiblingWithSameName(parentId, name).size() == 0
            : processCollectionRepository.findAllSameNameRootCollections(name).size() == 0;

        if (processCollectionDTO.getName().trim().length() == 0){
            throw new BadRequestAlertException("A new process collection cannot have blank name", ENTITY_NAME, "noname");
        }

        if (!isNameAvailable) {
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

    @PreAuthorize("@securityService.checkFeatureKeyAccess('" + FeatureKeyConstants.PROCESS_COLLECTION_EDIT + "')")
    @PutMapping("process-collection/{id}")
    public ResponseEntity<ProcessCollectionDTO> updateProcessCollection(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody ProcessCollectionDTO processCollectionDTO
    ) {
        log.debug("Request to update Process Collection. CollectionId: {}, ProcessCollection: {}", id, processCollectionDTO);

        UUID parentId = processCollectionDTO.getParentId();
        String name = processCollectionDTO.getName();
        List<ProcessCollection> sameNameSiblings =
            parentId != null
                ? processCollectionRepository.findSiblingWithSameName(parentId, name)
                : processCollectionRepository.findAllSameNameRootCollections(name);

        boolean isNameAvailable = sameNameSiblings.size() == 0
            || sameNameSiblings.size() == 1 && sameNameSiblings.get(0).getId().equals(id);

        if (processCollectionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processCollectionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (!processCollectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (parentId != null && !processCollectionRepository.existsById(parentId)) {
            throw new BadRequestAlertException("Parent not found", ENTITY_NAME, "parentnotfound");
        }
        if (!isNameAvailable) {
            throw new BadRequestAlertException("Name already taken", ENTITY_NAME, "nameexists");
        }

        ProcessCollectionDTO updated = processCollectionService.save(processCollectionDTO);

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .body(updated);
    }
}
