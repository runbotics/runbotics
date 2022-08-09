package com.runbotics.service.mapper;

import com.runbotics.domain.Process;
import com.runbotics.service.dto.ProcessDTO;
import com.runbotics.service.dto.ScheduleProcessDTO;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Process} and its DTO {@link ProcessDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class, ScheduleProcessMapper.class })
public interface ProcessMapper extends EntityMapper<ProcessDTO, Process> {
    @Mapping(target = "createdBy", source = "createdBy", qualifiedByName = "login")
    @Mapping(target = "schedules", ignore = true)
    @BeanMapping(qualifiedByName = "DTO")
    ProcessDTO toDto(Process s);

    @AfterMapping
    @Named("DTO")
    default void setProcessSchedules(@MappingTarget ProcessDTO processDTO, Process process) {
        if (process.getSchedules() == null) {
            processDTO.setSchedules(new HashSet<>());
        } else {
            Set<ScheduleProcessDTO> schedules = process
                .getSchedules()
                .stream()
                .map(ScheduleProcessMapper.INSTANCE::toDtoWithoutProcess)
                .collect(Collectors.toSet());

            processDTO.setSchedules(schedules);
        }
    }

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "botCollection", source = "botCollection")
    ProcessDTO toDtoName(Process process);
}
