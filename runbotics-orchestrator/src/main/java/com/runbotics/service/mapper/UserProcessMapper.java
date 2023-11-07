package com.runbotics.service.mapper;

import com.runbotics.domain.UserProcess;
import com.runbotics.service.dto.UserProcessDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the entity {@link UserProcess} and its DTO {@link UserProcessDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UserProcessMapper extends EntityMapper<UserProcessDTO, UserProcess> {

    @Mapping(target = "userId", source = "id.userId")
    @Mapping(target = "processId", source = "id.processId")
    UserProcessDTO toDto(UserProcess userProcess);

    @Mapping(target = "id.userId", source = "userId")
    @Mapping(target = "id.processId", source = "processId")
    UserProcess toEntity(UserProcessDTO userProcessDTO);
}
