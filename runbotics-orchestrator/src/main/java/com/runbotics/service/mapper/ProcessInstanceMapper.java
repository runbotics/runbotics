package com.runbotics.service.mapper;

import com.runbotics.domain.*;
import com.runbotics.service.dto.ProcessInstanceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ProcessInstance} and its DTO {@link ProcessInstanceDTO}.
 */
@Mapper(componentModel = "spring", uses = { ProcessMapper.class, BotMapper.class })
public interface ProcessInstanceMapper extends EntityMapper<ProcessInstanceDTO, ProcessInstance> {
    @Mapping(target = "process", source = "process", qualifiedByName = "name")
    @Mapping(target = "bot", source = "bot", qualifiedByName = "installationId")
    ProcessInstanceDTO toDto(ProcessInstance s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProcessInstanceDTO toDtoId(ProcessInstance processInstance);
}
