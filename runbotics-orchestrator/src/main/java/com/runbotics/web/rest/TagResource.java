package com.runbotics.web.rest;

import com.runbotics.repository.TagRepository;
import com.runbotics.service.TagQueryService;
import com.runbotics.service.TagService;
import com.runbotics.service.criteria.TagCriteria;
import com.runbotics.service.dto.TagDTO;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TagResource {

    private final Logger log = LoggerFactory.getLogger(TagResource.class);

    private static final String ENTITY_NAME = "tag";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TagService tagService;

    private final TagQueryService tagQueryService;

    private final TagRepository tagRepository;

    public TagResource(
        TagService tagService,
        TagQueryService tagQueryService,
        TagRepository tagRepository
    ) {
        this.tagService = tagService;
        this.tagQueryService = tagQueryService;
        this.tagRepository = tagRepository;
    }

    /**
     * {@code POST /tags} : creates a new tag.
     *
     * @param tagDTO the tag to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tag.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the id is present or name is already in use.
     */
    @PostMapping("/tags")
    public ResponseEntity<TagDTO> createTag(@RequestBody TagDTO tagDTO)
        throws URISyntaxException {
        log.debug("REST request to create new Tag : {}", tagDTO);

        if (tagDTO.getId() != null) {
            throw new BadRequestAlertException("A new tag cannot already have an ID", ENTITY_NAME, "idExists");
        }

        if (tagDTO.getName().equals("")) {
            throw new BadRequestAlertException("Tag name must contain not empty string", ENTITY_NAME, "emptyString");
        }

        if (tagRepository.findOneByName(tagDTO.getName()).isPresent()) {
            throw new BadRequestAlertException("Name already exists", ENTITY_NAME, "nameNotUnique");
        }

        final TagDTO result = tagService.save(tagDTO);
        return ResponseEntity
            .created(new URI("/api/tags" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET /tags} : get all the tags.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with the status {@code 200 (OK)} and the list of tags in body.
     */
    @GetMapping("/tags")
    public ResponseEntity<List<TagDTO>> getAllTags(TagCriteria criteria) {
        log.debug("REST request to get all Tags with criteria: {}", criteria);
        final List<TagDTO> tags = tagQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(tags);
    }

    /**
     * {@code GET /tags/:id} : get the tag by id.
     *
     * @param id the id of the tag to find.
     * @return the {@link ResponseUtil} with the status {@code 200 (OK)} and tag in body
     * if tag with this id exists, otherwise returns status {@code 404 (NOT FOUND)}.
     */
    @GetMapping("/tags/{id}")
    public ResponseEntity<TagDTO> getTag(@PathVariable Long id) {
        log.debug("REST request to get one Tag by id : {}", id);
        final Optional<TagDTO> tag = tagService.getOneTagById(id);
        return ResponseUtil.wrapOrNotFound(tag);
    }

    /**
     * {@code DELETE /tags/:id} : delete tag by id.
     *
     * @param id the id of the tag to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tags/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        log.debug("REST request to delete tag with id : {}", id);

        if (tagRepository.findById(id).isEmpty()) {
            throw new BadRequestAlertException("Tag with this id not exist", ENTITY_NAME, "idNotExist");
        }

        tagService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
