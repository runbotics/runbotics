package com.runbotics.service.mapper;

import com.runbotics.domain.*;
import com.runbotics.service.dto.ActionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Action} and its DTO {@link ActionDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ActionMapper extends EntityMapper<ActionDTO, Action> {}
