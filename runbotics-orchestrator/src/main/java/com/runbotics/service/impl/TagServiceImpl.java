package com.runbotics.service.impl;

import com.runbotics.domain.Tag;
import com.runbotics.repository.TagRepository;
import com.runbotics.service.TagService;
import com.runbotics.service.dto.TagDTO;
import com.runbotics.service.mapper.TagMapper;
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

    private final TagRepository tagRepository;

    private final TagMapper tagMapper;

    public TagServiceImpl(
        TagRepository tagRepository,
        TagMapper tagMapper
    ) {
        this.tagRepository = tagRepository;
        this.tagMapper = tagMapper;
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
}
