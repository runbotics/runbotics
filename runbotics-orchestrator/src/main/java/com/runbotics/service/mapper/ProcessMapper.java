package com.runbotics.service.mapper;

import com.runbotics.domain.Process;
import com.runbotics.service.dto.ProcessDTO;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Process} and its DTO {@link ProcessDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface ProcessMapper extends EntityMapper<ProcessDTO, Process> {
    @Mapping(target = "createdBy", source = "createdBy", qualifiedByName = "login")
    @Mapping(target = "editor", source = "editor", qualifiedByName = "login")
    @BeanMapping(qualifiedByName = "DTO")
    ProcessDTO toDto(Process s);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "botCollection", source = "botCollection")
    ProcessDTO toDtoName(Process process);
}
