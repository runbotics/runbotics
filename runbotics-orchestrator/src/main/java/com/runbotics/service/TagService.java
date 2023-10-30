package com.runbotics.service;

import com.runbotics.domain.Tag;
import com.runbotics.service.dto.ProcessDTO;
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

    /**
     * Removes Tag by id
     *
     * @param id
     */
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

    /**
     * Filters existing and new Tags:
     * - tags with correct id and name are being added to Set
     * - tags with only name are being created and then added to Set
     * all happens in order to update the Process
     *
     * @param tags
     * @return Set of Tags
     */
    Set<Tag> filterTags(Set<TagDTO> tags);

    /**
     * Checks which Tags should be deleted
     *
     * @param process
     * @return List of Tag ids
     */
    List<Long> checkTagsToDelete(ProcessDTO process);

    /**
     * Removes unused Tags
     *
     * @param tagIds
     */
    void deleteUnusedTags(List<Long> tagIds);
}
