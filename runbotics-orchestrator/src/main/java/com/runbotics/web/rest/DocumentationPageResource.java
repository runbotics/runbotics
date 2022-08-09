package com.runbotics.web.rest;

import com.runbotics.repository.DocumentationPageRepository;
import com.runbotics.security.AuthoritiesConstants;
import com.runbotics.service.DocumentationPageQueryService;
import com.runbotics.service.DocumentationPageService;
import com.runbotics.service.criteria.DocumentationPageCriteria;
import com.runbotics.service.dto.DocumentationPageDTO;
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
 * REST controller for managing {@link com.runbotics.domain.DocumentationPage}.
 */
@RestController
@RequestMapping("/api")
public class DocumentationPageResource {

    private final Logger log = LoggerFactory.getLogger(DocumentationPageResource.class);

    private static final String ENTITY_NAME = "documentationPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DocumentationPageService documentationPageService;

    private final DocumentationPageRepository documentationPageRepository;

    private final DocumentationPageQueryService documentationPageQueryService;

    public DocumentationPageResource(
        DocumentationPageService documentationPageService,
        DocumentationPageRepository documentationPageRepository,
        DocumentationPageQueryService documentationPageQueryService
    ) {
        this.documentationPageService = documentationPageService;
        this.documentationPageRepository = documentationPageRepository;
        this.documentationPageQueryService = documentationPageQueryService;
    }

    /**
     * {@code POST  /documentation-pages} : Create a new documentationPage.
     *
     * @param documentationPageDTO the documentationPageDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new documentationPageDTO, or with status {@code 400 (Bad Request)} if the documentationPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/documentation-pages")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<DocumentationPageDTO> createDocumentationPage(@RequestBody DocumentationPageDTO documentationPageDTO)
        throws URISyntaxException {
        log.debug("REST request to save DocumentationPage : {}", documentationPageDTO);
        if (documentationPageDTO.getId() != null) {
            throw new BadRequestAlertException("A new documentationPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DocumentationPageDTO result = documentationPageService.save(documentationPageDTO);
        return ResponseEntity
            .created(new URI("/api/documentation-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /documentation-pages/:id} : Updates an existing documentationPage.
     *
     * @param id the id of the documentationPageDTO to save.
     * @param documentationPageDTO the documentationPageDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentationPageDTO,
     * or with status {@code 400 (Bad Request)} if the documentationPageDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the documentationPageDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/documentation-pages/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<DocumentationPageDTO> updateDocumentationPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DocumentationPageDTO documentationPageDTO
    ) throws URISyntaxException {
        log.debug("REST request to update DocumentationPage : {}, {}", id, documentationPageDTO);
        if (documentationPageDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentationPageDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentationPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DocumentationPageDTO result = documentationPageService.save(documentationPageDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentationPageDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /documentation-pages/:id} : Partial updates given fields of an existing documentationPage, field will ignore if it is null
     *
     * @param id the id of the documentationPageDTO to save.
     * @param documentationPageDTO the documentationPageDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated documentationPageDTO,
     * or with status {@code 400 (Bad Request)} if the documentationPageDTO is not valid,
     * or with status {@code 404 (Not Found)} if the documentationPageDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the documentationPageDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/documentation-pages/{id}", consumes = "application/merge-patch+json")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<DocumentationPageDTO> partialUpdateDocumentationPage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DocumentationPageDTO documentationPageDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update DocumentationPage partially : {}, {}", id, documentationPageDTO);
        if (documentationPageDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, documentationPageDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!documentationPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DocumentationPageDTO> result = documentationPageService.partialUpdate(documentationPageDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, documentationPageDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /documentation-pages} : get all the documentationPages.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of documentationPages in body.
     */
    @GetMapping("/documentation-pages")
    public ResponseEntity<List<DocumentationPageDTO>> getAllDocumentationPages(DocumentationPageCriteria criteria, Pageable pageable) {
        log.debug("REST request to get DocumentationPages by criteria: {}", criteria);
        Page<DocumentationPageDTO> page = documentationPageQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /documentation-pages/count} : count all the documentationPages.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/documentation-pages/count")
    public ResponseEntity<Long> countDocumentationPages(DocumentationPageCriteria criteria) {
        log.debug("REST request to count DocumentationPages by criteria: {}", criteria);
        return ResponseEntity.ok().body(documentationPageQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /documentation-pages/:id} : get the "id" documentationPage.
     *
     * @param id the id of the documentationPageDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the documentationPageDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/documentation-pages/{id}")
    public ResponseEntity<DocumentationPageDTO> getDocumentationPage(@PathVariable Long id) {
        log.debug("REST request to get DocumentationPage : {}", id);
        Optional<DocumentationPageDTO> documentationPageDTO = documentationPageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(documentationPageDTO);
    }

    /**
     * {@code DELETE  /documentation-pages/:id} : delete the "id" documentationPage.
     *
     * @param id the id of the documentationPageDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/documentation-pages/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteDocumentationPage(@PathVariable Long id) {
        log.debug("REST request to delete DocumentationPage : {}", id);
        documentationPageService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
