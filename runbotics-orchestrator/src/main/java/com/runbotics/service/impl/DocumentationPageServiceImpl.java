package com.runbotics.service.impl;

import com.runbotics.domain.DocumentationPage;
import com.runbotics.repository.DocumentationPageRepository;
import com.runbotics.service.DocumentationPageService;
import com.runbotics.service.dto.DocumentationPageDTO;
import com.runbotics.service.mapper.DocumentationPageMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link DocumentationPage}.
 */
@Service
@Transactional
public class DocumentationPageServiceImpl implements DocumentationPageService {

    private final Logger log = LoggerFactory.getLogger(DocumentationPageServiceImpl.class);

    private final DocumentationPageRepository documentationPageRepository;

    private final DocumentationPageMapper documentationPageMapper;

    public DocumentationPageServiceImpl(
        DocumentationPageRepository documentationPageRepository,
        DocumentationPageMapper documentationPageMapper
    ) {
        this.documentationPageRepository = documentationPageRepository;
        this.documentationPageMapper = documentationPageMapper;
    }

    @Override
    public DocumentationPageDTO save(DocumentationPageDTO documentationPageDTO) {
        log.debug("Request to save DocumentationPage : {}", documentationPageDTO);
        DocumentationPage documentationPage = documentationPageMapper.toEntity(documentationPageDTO);
        documentationPage = documentationPageRepository.save(documentationPage);
        return documentationPageMapper.toDto(documentationPage);
    }

    @Override
    public Optional<DocumentationPageDTO> partialUpdate(DocumentationPageDTO documentationPageDTO) {
        log.debug("Request to partially update DocumentationPage : {}", documentationPageDTO);

        return documentationPageRepository
            .findById(documentationPageDTO.getId())
            .map(
                existingDocumentationPage -> {
                    documentationPageMapper.partialUpdate(existingDocumentationPage, documentationPageDTO);
                    return existingDocumentationPage;
                }
            )
            .map(documentationPageRepository::save)
            .map(documentationPageMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentationPageDTO> findAll(Pageable pageable) {
        log.debug("Request to get all DocumentationPages");
        return documentationPageRepository.findAll(pageable).map(documentationPageMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocumentationPageDTO> findOne(Long id) {
        log.debug("Request to get DocumentationPage : {}", id);
        return documentationPageRepository.findById(id).map(documentationPageMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete DocumentationPage : {}", id);
        documentationPageRepository.deleteById(id);
    }
}
