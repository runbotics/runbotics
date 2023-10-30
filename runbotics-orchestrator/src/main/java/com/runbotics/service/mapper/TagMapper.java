package com.runbotics.service.mapper;

import com.runbotics.domain.Tag;
import com.runbotics.service.dto.TagDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the entity {@link Tag} and its DTO {@link TagDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TagMapper extends EntityMapper<TagDTO, Tag> {

    @BeanMapping(qualifiedByName = "DTO")
    TagDTO toDto(Tag tag);
}
