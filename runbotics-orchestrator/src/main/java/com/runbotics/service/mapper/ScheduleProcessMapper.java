package com.runbotics.service.mapper;

import com.runbotics.domain.ScheduleProcess;
import com.runbotics.service.dto.ScheduleProcessDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

/**
 * Mapper for the entity {@link ScheduleProcess} and its DTO {@link ScheduleProcessDTO}.
 */
@Mapper(componentModel = "spring", uses = { ProcessMapper.class, BotMapper.class })
public interface ScheduleProcessMapper extends EntityMapper<ScheduleProcessDTO, ScheduleProcess> {
    ScheduleProcessMapper INSTANCE = Mappers.getMapper(ScheduleProcessMapper.class);

    @Mapping(target = "process", source = "process", qualifiedByName = "name")
    ScheduleProcessDTO toDto(ScheduleProcess s);

    @Named("withoutProcess")
    @Mapping(target = "process", ignore = true)
    ScheduleProcessDTO toDtoWithoutProcess(ScheduleProcess s);
}
