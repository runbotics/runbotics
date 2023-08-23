package com.runbotics.service;

import com.runbotics.domain.Tag;
import com.runbotics.service.dto.TagDTO;
import java.util.*;

/**
 * Service Interface for managing {@link com.runbotics.domain.Tag}.
 */
public interface TagService {

    /**
     * Creates a Tag
     *
     * @param tagDTO
     * @return TagDTO enitity
     */
    TagDTO save(TagDTO tagDTO);

    void delete(Long id);

    /**
     * Gets one Tag by id
     *
     * @param id
     * @return TagDTO entity
     */
    Optional<TagDTO> getOneTagById(Long id);

    /**
     * Gets one Tag by name
     *
     * @param name
     * @return TagDTO enitity
     */
    Optional<TagDTO> getOneTagByName(String name);

    /**
     * Gets all Tags
     *
     * @return List of TagDTO entities
     */
    List<TagDTO> getAllTags();
}
