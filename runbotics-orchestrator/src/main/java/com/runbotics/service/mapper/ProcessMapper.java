package com.runbotics.service.mapper;

import com.runbotics.domain.Process;
import com.runbotics.service.dto.ProcessDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Process} and its DTO {@link ProcessDTO}.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, ScheduleProcessMapper.class})
public interface ProcessMapper extends EntityMapper<ProcessDTO, Process> {
    @Mapping(target = "createdBy", source = "createdBy", qualifiedByName = "login")
    @Mapping(target = "schedules", ignore = true)
    @BeanMapping(qualifiedByName = "DTO")
    ProcessDTO toDto(Process s);

    @Named("diagramUpdate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, mappingControl = )
    void diagramUpdate(@MappingTarget Process entity, ProcessDTO dto);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "botCollection", source = "botCollection")
    ProcessDTO toDtoName(Process process);
}
