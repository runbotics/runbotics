package com.runbotics.service.mapper;

import com.runbotics.domain.*;
import com.runbotics.service.dto.BotDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Bot} and its DTO {@link BotDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface BotMapper extends EntityMapper<BotDTO, Bot> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    BotDTO toDto(Bot s);

    @Named("installationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "installationId", source = "installationId")
    BotDTO toDtoInstallationId(Bot bot);
}
