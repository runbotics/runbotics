package com.runbotics.service;

import com.runbotics.service.dto.DocumentationPageDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.runbotics.domain.DocumentationPage}.
 */
public interface DocumentationPageService {
    /**
     * Save a documentationPage.
     *
     * @param documentationPageDTO the entity to save.
     * @return the persisted entity.
     */
    DocumentationPageDTO save(DocumentationPageDTO documentationPageDTO);

    /**
     * Partially updates a documentationPage.
     *
     * @param documentationPageDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DocumentationPageDTO> partialUpdate(DocumentationPageDTO documentationPageDTO);

    /**
     * Get all the documentationPages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DocumentationPageDTO> findAll(Pageable pageable);

    /**
     * Get the "id" documentationPage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DocumentationPageDTO> findOne(Long id);

    /**
     * Delete the "id" documentationPage.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
