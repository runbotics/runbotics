package com.runbotics.service.mapper;

import com.runbotics.domain.*;
import com.runbotics.service.dto.ProcessInstanceEventDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProcessInstanceEvent} and its DTO {@link ProcessInstanceEventDTO}.
 */
@Mapper(componentModel = "spring", uses = { ProcessInstanceMapper.class })
public interface ProcessInstanceEventMapper extends EntityMapper<ProcessInstanceEventDTO, ProcessInstanceEvent> {
    @Mapping(target = "processInstance", source = "processInstance", qualifiedByName = "id")
    ProcessInstanceEventDTO toDto(ProcessInstanceEvent s);
}
