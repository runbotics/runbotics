package com.runbotics.service.mapper;

import com.runbotics.domain.GlobalVariable;
import com.runbotics.service.dto.CreateGlobalVariableDTO;
import com.runbotics.service.dto.GlobalVariableDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the entity {@link GlobalVariable} and its DTO {@link GlobalVariableDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface CreateGlobalVariableMapper extends EntityMapper<CreateGlobalVariableDTO, GlobalVariable> {
    @Override
    GlobalVariable toEntity(CreateGlobalVariableDTO dto);
}
