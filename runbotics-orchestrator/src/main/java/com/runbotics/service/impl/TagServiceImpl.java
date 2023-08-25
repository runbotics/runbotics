package com.runbotics.service.impl;

import com.runbotics.domain.Tag;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.repository.TagRepository;
import com.runbotics.service.TagService;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.dto.TagDTO;
import com.runbotics.service.mapper.TagMapper;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing tags.
 */
@Service
@Transactional
public class TagServiceImpl implements TagService{
    private final Logger log = LoggerFactory.getLogger(TagServiceImpl.class);

    private static final String ENTITY_NAME = "tag";

    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    private final ProcessRepository processRepository;

    public TagServiceImpl(
        TagRepository tagRepository,
        TagMapper tagMapper,
        ProcessRepository processRepository
    ) {
        this.tagRepository = tagRepository;
        this.tagMapper = tagMapper;
        this.processRepository = processRepository;
    }

    @Override
    public TagDTO save(TagDTO tagDTO) {
        log.debug("Request to save Tag : {}", tagDTO);
        Tag tag = tagMapper.toEntity(tagDTO);
        tag = tagRepository.save(tag);
        return tagMapper.toDto(tag);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete tag with id : {}", id);
        tagRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Optional<TagDTO> getOneTagById(Long id) {
        return tagRepository.findOneById(id).map(tagMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<TagDTO> getOneTagByName(String name) {
        return tagRepository.findOneByName(name).map(tagMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream().map(TagDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Set<TagDTO> createNewTags(Set<TagDTO> tags) {
        return tags.stream().map(this::save).collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public Set<Tag> processTags(Set<TagDTO> tags) {
        Set<TagDTO> existingTags = new HashSet<>();
        Set<TagDTO> newTags = new HashSet<>();

        tags.forEach(tag -> {
            if (tag.getId() != null) {
                if(tagRepository.findOneByIdAndName(tag.getId(), tag.getName()).isEmpty()) {
                    throw new BadRequestAlertException("No tag found with this id and name", ENTITY_NAME, "tagNotFound");
                }

                existingTags.add(tag);
            }
            else {
                if (tag.getName().equals("")) {
                    throw new BadRequestAlertException("Tag name must contain not empty string", ENTITY_NAME, "emptyString");
                }
                if (tagRepository.findOneByName(tag.getName()).isPresent()) {
                    throw new BadRequestAlertException("Tag with this name already exist", ENTITY_NAME, "tagNameExists");
                }

                newTags.add(tag);
            }
        });

        Set<TagDTO> processedTags = createNewTags(newTags);
        processedTags.addAll(existingTags);

        return processedTags.stream().map(tagMapper::toEntity).collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public List<Long> checkTagsToDelete(ProcessDTO processDTO) {
        List<Long> incomingTagIds = processDTO.getTags()
            .stream().map(TagDTO::getId).collect(Collectors.toList());

        List<Long> existingTagIds = processRepository.findById(processDTO.getId())
            .orElseThrow(
                () -> new BadRequestAlertException("No tag found with this id", ENTITY_NAME, "tagNotFound")
            )
            .getTags().stream().map(Tag::getId).collect(Collectors.toList());

        existingTagIds.removeIf(incomingTagIds::contains);
        return existingTagIds;
    }

    @Transactional(readOnly = true)
    public void deleteUnusedTags(List<Long> tagIds) {
        tagIds.forEach(tagId -> {
            if (tagRepository.countTags(tagId) == 0) {
                this.delete(tagId);
            }
        });
    }
}
