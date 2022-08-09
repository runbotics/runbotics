package com.runbotics.service.mapper;

import com.runbotics.domain.*;
import com.runbotics.service.dto.GlobalVariableDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GlobalVariable} and its DTO {@link GlobalVariableDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface GlobalVariableMapper extends EntityMapper<GlobalVariableDTO, GlobalVariable> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    GlobalVariableDTO toDto(GlobalVariable s);
}
