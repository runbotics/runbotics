package com.runbotics.service.mapper;

import com.runbotics.domain.*;
import com.runbotics.service.dto.DocumentationPageDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DocumentationPage} and its DTO {@link DocumentationPageDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DocumentationPageMapper extends EntityMapper<DocumentationPageDTO, DocumentationPage> {}
