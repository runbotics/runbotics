package com.runbotics.service.impl;

import com.runbotics.domain.Tag;
import com.runbotics.domain.User;
import com.runbotics.repository.ProcessRepository;
import com.runbotics.repository.TagRepository;
import com.runbotics.service.TagService;
import com.runbotics.service.UserService;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.dto.TagDTO;
import com.runbotics.service.mapper.TagMapper;
import com.runbotics.web.rest.errors.BadRequestAlertException;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing tags.
 */
@Service
@Transactional
public class TagServiceImpl implements TagService {

    private final Logger log = LoggerFactory.getLogger(TagServiceImpl.class);

    private static final String ENTITY_NAME = "tag";

    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    private final ProcessRepository processRepository;

    private final UserService userService;

    public TagServiceImpl(TagRepository tagRepository, TagMapper tagMapper, ProcessRepository processRepository, UserService userService) {
        this.tagRepository = tagRepository;
        this.tagMapper = tagMapper;
        this.processRepository = processRepository;
        this.userService = userService;
    }

    @Override
    public TagDTO save(TagDTO tagDTO) {
        log.debug("Request to save Tag : {}", tagDTO);
        User requester = userService.getUserWithAuthorities().get();

        Tag tag = tagMapper.toEntity(tagDTO);
        tag.setTenant(requester.getTenant());
        tag = tagRepository.save(tag);
        return tagMapper.toDto(tag);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete tag with id : {}", id);
        tagRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Set<TagDTO> createNewTags(Set<TagDTO> tags) {
        return tags.stream().map(this::save).collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public Set<Tag> filterTags(Set<TagDTO> tags) {
        Set<TagDTO> existingTags = new HashSet<>();
        Set<TagDTO> newTags = new HashSet<>();

        tags.forEach(
            tag -> {
                if (tag.getId() != null) {
                    if (tagRepository.findOneByIdAndName(tag.getId(), tag.getName()).isEmpty()) {
                        throw new BadRequestAlertException("No tag found with this id and name", ENTITY_NAME, "tagNotFound");
                    }

                    existingTags.add(tag);
                } else {
                    if (tag.getName().equals("")) {
                        throw new BadRequestAlertException("Tag name must contain not empty string", ENTITY_NAME, "emptyString");
                    }
                    if (tagRepository.findOneByName(tag.getName()).isPresent()) {
                        throw new BadRequestAlertException("Tag with this name already exist", ENTITY_NAME, "tagNameExists");
                    }

                    newTags.add(tag);
                }
            }
        );

        Set<TagDTO> filteredTags = createNewTags(newTags);
        filteredTags.addAll(existingTags);

        return filteredTags.stream().map(tagMapper::toEntity).collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public List<Long> checkTagsToDelete(ProcessDTO processDTO) {
        List<Long> incomingTagIds = processDTO.getTags().stream().map(TagDTO::getId).collect(Collectors.toList());

        List<Long> existingTagIds = processRepository
            .findById(processDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Cannot find process with his tags", ENTITY_NAME, "processNotFound"))
            .getTags()
            .stream()
            .map(Tag::getId)
            .collect(Collectors.toList());

        existingTagIds.removeIf(incomingTagIds::contains);
        return existingTagIds;
    }

    @Transactional(readOnly = true)
    public void deleteUnusedTags(List<Long> tagIds) {
        tagIds.forEach(
            tagId -> {
                if (tagRepository.countTags(tagId) == 0) {
                    this.delete(tagId);
                }
            }
        );
    }
}
