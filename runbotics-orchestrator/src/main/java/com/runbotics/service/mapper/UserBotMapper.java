package com.runbotics.service.mapper;

import com.runbotics.domain.UserBot;
import com.runbotics.service.dto.UserBotDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the entity {@link UserBot} and its DTO {@link UserBotDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface UserBotMapper extends EntityMapper<UserBotDTO, UserBot> {

    @Mapping(target = "userId", source = "id.userId")
    @Mapping(target = "botId", source = "id.botId")
    UserBotDTO toDto(UserBot userBot);

    @Mapping(target = "id.userId", source = "userId")
    @Mapping(target = "id.botId", source = "botId")
    UserBot toEntity(UserBotDTO userBotDTO);
}
